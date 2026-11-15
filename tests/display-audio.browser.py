"""Run with the local Node server and Python Playwright + installed Chrome.

CDP reads intentionally disable userGesture: ordinary automation evaluations
can accidentally unlock autoplay and hide the original production failure.
An optional URL argument exercises a deployed preview without writing station state.
"""
import json
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = (sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:4173').rstrip('/')
OUT = Path('artifacts/display-audio')
OUT.mkdir(parents=True, exist_ok=True)


def snapshot(cdp):
    result = cdp.send('Runtime.evaluate', {
        'expression': '''JSON.stringify((()=>{
          const video=document.querySelector('#app video');
          const panel=document.querySelector('.display-audio-setup');
          return {hasVideo:!!video,muted:video?.muted,paused:video?.paused,
            currentTime:video?.currentTime,src:video?.currentSrc,
            audioBytes:video?.webkitAudioDecodedByteCount,
            samePlayer:!!video&&video===window.audioTestPlayer,
            retainedPaused:window.audioTestPlayer?.paused,
            setupVisible:!!panel&&!panel.hidden,
            activation:navigator.userActivation.hasBeenActive};
        })())''',
        'returnByValue': True, 'userGesture': False,
    })
    return json.loads(result['result']['value'])


def wait(page, cdp, predicate, label, timeout=25000):
    for _ in range(timeout // 200):
        current = snapshot(cdp)
        if predicate(current):
            return current
        page.wait_for_timeout(200)
    raise AssertionError(f'{label}: {snapshot(cdp)}')


with sync_playwright() as p:
    report = []
    for policy in ['user-gesture-required', 'no-user-gesture-required']:
        browser = p.chromium.launch(
            channel='chrome', headless=True,
            ignore_default_args=['--enable-automation'],
            args=['--autoplay-policy=' + policy,
                  '--disable-features=PreloadMediaEngagementData,MediaEngagementBypassAutoplayPolicies'],
        )
        context = browser.new_context(viewport={'width':1280,'height':800})
        state = {'view':'home','projectId':None}
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))

        def reply(route):
            # Only this test browser sees these packets; no Firebase/local state writes.
            packet = dict(state)
            route.fulfill(json={'stationId':1, 'payload':json.dumps(packet)}
                          if BASE.startswith('https:') else packet)

        page.route('**/api/state?*', reply)
        page.route('https://f1-sap-default-rtdb.firebaseio.com/**', reply)
        page.goto(BASE + '/display.html?station=1', wait_until='load')
        cdp = context.new_cdp_session(page)
        page.wait_for_timeout(1000)
        initial = snapshot(cdp)
        assert initial['setupVisible'] == (policy == 'user-gesture-required'), initial
        assert not initial['activation'], initial

        if policy == 'user-gesture-required':
            # First reproduce a blocked, muted video; enable sound without restarting it.
            state.update(view='project', projectId='01', mode='video', language='en')
            muted = wait(page, cdp, lambda s:s.get('muted') and s.get('currentTime',0)>.5,
                         'blocked AquaData must keep playing silently')
            assert muted['setupVisible'] and not muted['activation'], muted
            page.screenshot(path=str(OUT / 'blocked-aquadata.png'))
            page.locator('[data-display-audio-enable]').click()
            enabled = wait(page, cdp, lambda s:s.get('muted') is False and not s['setupVisible'],
                           'setup must restore sound')
            assert enabled['currentTime'] >= muted['currentTime'], (muted, enabled)

        # Record player identity without granting activation in the kiosk case.
        if not snapshot(cdp)['hasVideo']:
            state.update(view='project', projectId='01', mode='video', language='en')
            wait(page, cdp, lambda s:s.get('currentTime',0)>.5, 'first kiosk video')
        cdp.send('Runtime.evaluate', {
            'expression':"window.audioTestPlayer=document.querySelector('#app video');true",
            'userGesture':False,
        })
        for project in ['03','04','06','08','01']:
            state.clear(); state.update(view='home',projectId=None)
            wait(page, cdp, lambda s:not s['hasVideo'] and s.get('retainedPaused'), 'return Home stops audio')
            assert not snapshot(cdp)['setupVisible']
            state.update(view='project', projectId=project, mode='video',language='en')
            current = wait(page, cdp, lambda s:s.get('currentTime',0)>.5,
                           'video for project '+project)
            assert not current['muted'] and not current['paused'], current
            assert current['samePlayer'] and not current['setupVisible'], current
            assert current['audioBytes'] > 0, current
            report.append({'policy':policy,'project':project,'soundEnabled':True,'samePlayer':True})
        page.screenshot(path=str(OUT / (policy + '.png')))

        # Refresh must work unattended with the configured browser launch flag.
        # An ordinary browser must honestly request setup again, regardless of storage.
        page.reload(wait_until='load')
        after_reload = wait(page, cdp, lambda s:s.get('currentTime',0)>.5, 'video after reload')
        assert after_reload['muted'] == (policy == 'user-gesture-required'), after_reload
        assert after_reload['setupVisible'] == (policy == 'user-gesture-required'), after_reload
        if policy == 'user-gesture-required':
            state.clear(); state.update(view='home',projectId=None)
            wait(page, cdp, lambda s:not s['hasVideo'], 'Home setup')
            page.locator('[data-display-audio-enable]').click()
            wait(page, cdp, lambda s:not s['setupVisible'], 'setup tone at Home')
            state.update(view='project',projectId='08',mode='video',language='en')
            current=wait(page, cdp, lambda s:s.get('currentTime',0)>.5, 'video after Home setup')
            assert not current['muted'] and not current['setupVisible'], current
        assert not errors, errors
        browser.close()
    (OUT / 'report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(json.dumps({'videoChecks':report,'reloadChecksPassed':True,'pageErrors':[]}),flush=True)
