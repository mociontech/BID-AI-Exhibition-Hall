(function(){
  const root=document.getElementById('sessions');
  const status=document.getElementById('status');
  const storageKey='ai-exhibition-private-rooms-v1';
  let saved={};
  try{saved=JSON.parse(localStorage.getItem(storageKey)||'{}')||{};}catch{}
  function newCode(){
    const bytes=new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
  }
  function save(){localStorage.setItem(storageKey,JSON.stringify(saved));}
  for(let i=1;i<=10;i++){
    if(!/^[a-f0-9]{32}$/.test(saved[i]||''))saved[i]=newCode();
  }
  save();
  function link(path,station,code){const url=new URL(path,location.href);url.searchParams.set('station',station);url.searchParams.set('room',code);return url.href;}
  function show(){
    root.replaceChildren();
    for(let i=1;i<=10;i++){
      const code=saved[i],tablet=link('index.html',i,code),tv=link('display.html',i,code);
      const card=document.createElement('section');card.className='session';
      const heading=document.createElement('h2');heading.textContent=`Sala ${String(i).padStart(2,'0')}`;
      const label=document.createElement('code');label.textContent=`Código: ${code}`;
      const actions=document.createElement('div');actions.className='actions';
      for(const [name,url] of [['Abrir tableta',tablet],['Abrir TV',tv]]){
        const anchor=document.createElement('a');anchor.href=url;anchor.target='_blank';anchor.rel='noopener';anchor.textContent=name;actions.append(anchor);
        const copy=document.createElement('button');copy.type='button';copy.className='secondary';copy.textContent=`Copiar ${name==='Abrir TV'?'TV':'tableta'}`;
        copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(url);status.textContent=`Enlace de ${name==='Abrir TV'?'TV':'tableta'} de sala ${i} copiado.`;}catch{status.textContent='No se pudo copiar. Abre el enlace y copia la dirección del navegador.';}});actions.append(copy);
      }
      const renew=document.createElement('button');renew.type='button';renew.className='secondary';renew.textContent='Cambiar código';
      renew.addEventListener('click',()=>{saved[i]=newCode();save();show();status.textContent=`Código de sala ${i} cambiado. Abre los nuevos enlaces en la tableta y TV.`;});
      actions.append(renew);card.append(heading,label,actions);root.append(card);
    }
  }
  show();
})();
