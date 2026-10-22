/*
   KORB HEALTH — INSULIN SYRINGE DRAWING

   One drawing of a U-100 insulin syringe filled to a number of units, shared by
   every patient page that shows a patient what to draw. Moved here 2026-10-22
   out of KORB_GLP1_Dose_Guide.html, where it was a private function, because
   the per-product medication pages need the same picture. Two copies of a
   picture a patient doses from is how the two would come to disagree.

   Moved byte for byte: the Dose Guide's drawing for every whole unit from 1 to
   200 was captured before the move and compared after, and all 200 match.

   Doses over 100 units take TWO standard 100-unit syringes. KORB does not ship
   3 mL syringes, so the drawing shows the first full and the second filled to
   the remainder.

   Usage: KORB_SYRINGE.svg(units, colorHex) returns an HTML string.
*/
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) { module.exports = factory(); }
  else { root.KORB_SYRINGE = factory(); }
}(typeof self !== 'undefined' ? self : this, function () {

  function singleSyringe(fillUnits,colorHex,widthScale){
    var bx=58,bw=196*widthScale,by=15,bh=24;
    var clamped=Math.max(0,Math.min(100,fillUnits));
    var w=bx+(clamped/100)*bw;
    var s='<svg viewBox="0 0 '+(bx+bw+40)+' 58" style="width:100%;max-width:'+(widthScale<1?280:320)+'px;height:auto;display:block;">';
    s+='<line x1="4" y1="27" x2="34" y2="27" stroke="#8A8F98" stroke-width="2"/>';
    s+='<path d="M34 25 L'+bx+' '+by+' L'+bx+' '+(by+bh)+' L34 29 Z" fill="#fff" stroke="#8A8F98" stroke-width="1"/>';
    s+='<rect x="'+bx+'" y="'+by+'" width="'+bw+'" height="'+bh+'" rx="3" fill="#fff" stroke="#8A8F98" stroke-width="1.5"/>';
    s+='<rect x="'+(bx+bw-3)+'" y="'+(by-6)+'" width="6" height="'+(bh+12)+'" fill="#EEF0F7" stroke="#8A8F98" stroke-width="1"/>';
    s+='<rect x="'+bx+'" y="'+by+'" width="'+Math.max(0,(w+1)-bx)+'" height="'+bh+'" fill="'+colorHex+'" opacity="0.22"/>';
    for(var u=0;u<=100;u+=10){
      var x=bx+(u/100)*bw;
      var tall=(u%20===0);
      s+='<line x1="'+x+'" y1="'+by+'" x2="'+x+'" y2="'+(by+(tall?9:5))+'" stroke="#5A6070" stroke-width="1"/>';
      if(tall) s+='<text x="'+x+'" y="'+(by-3)+'" font-size="7" text-anchor="middle" fill="#5A6070" font-family="Arial,sans-serif">'+u+'</text>';
    }
    s+='<rect x="'+(w+1)+'" y="'+(by+1)+'" width="7" height="'+(bh-2)+'" fill="#2B2F36"/>';
    var rodEnd=bx+bw+24;
    s+='<rect x="'+(w+8)+'" y="'+(by+bh/2-2)+'" width="'+Math.max(0,rodEnd-(w+8))+'" height="4" fill="#C6CAD2"/>';
    s+='<rect x="'+rodEnd+'" y="'+(by-5)+'" width="10" height="'+(bh+10)+'" rx="2" fill="#EEF0F7" stroke="#8A8F98" stroke-width="1"/>';
    s+='</svg>';
    return s;
  }

  function svg(units,colorHex){
    if(units<=100){
      return singleSyringe(units,colorHex,1);
    }
    var first=100, second=units-100;
    var wrap='<div style="display:flex;flex-direction:column;gap:10px;align-items:center;margin-top:4px;">';
    wrap+='<div style="width:100%;"><div style="font-size:9.5px;color:var(--mu);text-align:center;margin-bottom:2px;">Syringe 1 — fill completely (100 units)</div>'+singleSyringe(first,colorHex,0.85)+'</div>';
    wrap+='<div style="width:100%;"><div style="font-size:9.5px;color:var(--mu);text-align:center;margin-bottom:2px;">Syringe 2 — fill to '+second+' units</div>'+singleSyringe(second,colorHex,0.85)+'</div>';
    wrap+='</div>';
    return wrap;
  }

  return { svg: svg, single: singleSyringe };
}));
