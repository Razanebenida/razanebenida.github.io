const list = document.querySelector('#publication-list');
const search = document.querySelector('#search');
let filter = 'All';
function render() {
 const query = search.value.toLowerCase().trim();
 const posts = (window.PUBLICATIONS || []).filter(p => {if (!(p.url || '').trim()) return true; try {return ['http:', 'https:'].includes(new URL(p.url).protocol);}catch{return false;}}).filter(p => (filter === 'All' || p.type === filter) && `${p.title} ${p.description || ''}`.toLowerCase().includes(query)).sort((a,b) => (b.date || '').localeCompare(a.date || ''));
 list.replaceChildren();
 if (!posts.length) {const empty=document.createElement('div');empty.className='empty';const title=document.createElement('strong');title.textContent=query ? 'No matching publications.' : filter==='All' ? 'A space for new perspectives.' : `New ${filter.toLowerCase()}s will appear here.`;const text=document.createElement('p');text.textContent=query ? 'Try another keyword or publication type.' : 'Articles, podcast episodes and research will be shared here as they are added.';empty.append(title,text);list.append(empty);return;}
 posts.forEach(p=>{const item=document.createElement('article');item.className='publication-item';const meta=document.createElement('div');meta.className='date';meta.textContent=`${p.type} · ${p.date || ''}`;const body=document.createElement('div');const title=document.createElement('h3');title.textContent=p.title;const desc=document.createElement('p');desc.textContent=p.description || '';body.append(title,desc);if(p.url){const a=document.createElement('a');a.href=p.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=p.type==='Podcast'?'Listen to episode ↗':'Read publication ↗';body.append(a);}item.append(meta,body);list.append(item);});
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});render();}));
search.addEventListener('input',render);document.querySelector('#year').textContent=new Date().getFullYear();render();
