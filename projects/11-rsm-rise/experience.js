/* Every RISE receiver state uses the supplied v36, including first entry. */
window.RSM_RISE={renderDisplay(mount,data){
 const game=['game','results'].includes(data.mode)?RISE_STATE.sanitize(data.game):null;
 RISE_GAME.renderDisplay(mount,{...data,game:game||RISE_STATE.fresh(),language:data.language==='es'?'es':'en'});
}};
