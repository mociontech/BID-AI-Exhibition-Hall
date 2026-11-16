"""Produce the paired device page from the supplied, unchanged v51 prototype."""
from pathlib import Path
import re

root = Path(__file__).resolve().parent
source = (root / 'source.html').read_text(encoding='utf-8')
styles = re.search(r'<style>(.*?)</style>', source, re.S).group(1)
scripts = re.findall(r'<script>(.*?)</script>', source, re.S)
assert len(scripts) == 2
# Only the controller owns automatic transitions; their original durations remain.
scripts[1] = scripts[1].replace("if(sc==='dsg'){dsgT=", "if(sc==='dsg'&&ciRole!=='display'){dsgT=")
scripts[1] = scripts[1].replace("if(sc==='ptr'){dsgT=", "if(sc==='ptr'&&ciRole!=='display'){dsgT=")
scripts[1] = scripts[1].replace('},750);},3700);', '},ciDelay(4450));},ciDelay(3700));')
scripts[1] = scripts[1].replace('},750);},4600);', '},ciDelay(5350));},ciDelay(4600));')
marker = '  reset();\n  i18nApply();'
assert marker in scripts[1]
scripts[1] = scripts[1].replace(marker, (root / 'bridge.inc.js').read_text(encoding='utf-8'))
fonts = (root / 'fonts.css').read_text(encoding='utf-8')
page = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Country Strategies v51</title>'
page += '<script>document.documentElement.dataset.device=new URLSearchParams(location.search).get("role")==="display"?"display":"tablet";</script>'
page += '<style>' + fonts + styles + '</style><link rel="stylesheet" href="device.css"></head><body>'
page += '<span id="tvstate" hidden></span><div class="tv" id="tv" aria-live="polite"></div><div class="tab" id="tab"></div>'
page += ''.join('<script>' + script + '</script>' for script in scripts)
page += '</body></html>'
(root / 'device.html').write_text(page, encoding='utf-8')
print('Built v51/device.html from original styles and both original scripts.')
