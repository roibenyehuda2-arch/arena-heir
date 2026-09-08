document.addEventListener('click',event=>{
  const action=event.target.closest?.('[data-action]');
  if(!action||action.disabled)return;
  document.querySelectorAll('[data-action].committed').forEach(button=>button.classList.remove('committed'));
  action.classList.add('committed');
  action.setAttribute('aria-pressed','true');
},{capture:true});
