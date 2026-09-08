// Screen space keeps silhouettes readable; logical attack ranges stay in the engine.
export function positions(width,player,enemy){
  const minimum=width<=380?152:width<=700?170:230;
  const margin=width<=700?65:120;
  const gap=Math.min(width-margin*2,Math.max(minimum,(enemy-player)*width*.095));
  const midpoint=Math.max(margin+gap/2,Math.min(width-margin-gap/2,width*(.12+(player+enemy)*.0475)));
  return {player:midpoint-gap/2,enemy:midpoint+gap/2};
}
