import {inflateSync} from 'node:zlib';
// Decode browser PNGs with Node built-ins, without adding image dependencies.
function decode(png){
 let width,height,channels;const chunks=[];
 for(let offset=8;offset<png.length;){
  const length=png.readUInt32BE(offset),type=png.toString('ascii',offset+4,offset+8),data=png.subarray(offset+8,offset+8+length);
  if(type==='IHDR'){
   width=data.readUInt32BE(0);height=data.readUInt32BE(4);channels=data[9]===6?4:data[9]===2?3:0;
   if(data[8]!==8||!channels||data[12]!==0)throw Error('Expected non-interlaced 8-bit RGB/RGBA PNG');
  }
  if(type==='IDAT')chunks.push(data);
  offset+=length+12;
 }
 const bytes=inflateSync(Buffer.concat(chunks)),stride=width*channels,pixels=Buffer.alloc(stride*height);
 const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
 for(let y=0;y<height;y++){
  const filter=bytes[y*(stride+1)];
  for(let x=0;x<stride;x++){
   const at=y*stride+x,left=x>=channels?pixels[at-channels]:0,up=y?pixels[at-stride]:0,corner=y&&x>=channels?pixels[at-stride-channels]:0;
   const prediction=[0,left,up,Math.floor((left+up)/2),paeth(left,up,corner)][filter];
   if(prediction===undefined)throw Error('Unsupported PNG filter');
   pixels[at]=(bytes[y*(stride+1)+1+x]+prediction)&255;
  }
 }
 return {width,height,channels,pixels};
}
export function compare(original,current){
 if(original.equals(current))return {identical:true,match:true,differentPixels:0,fraction:0};
 const a=decode(original),b=decode(current);
 if(a.width!==b.width||a.height!==b.height||a.channels!==b.channels)return {identical:false,match:false,reason:'Image dimensions differ'};
 let differentPixels=0;
 for(let i=0;i<a.pixels.length;i+=a.channels){
  let delta=0;for(let c=0;c<a.channels;c++)delta=Math.max(delta,Math.abs(a.pixels[i+c]-b.pixels[i+c]));
  if(delta>8)differentPixels++;
 }
 const fraction=differentPixels/(a.width*a.height);
 // Tiny edge rasterization differences occur in SVG circles and icon strokes.
 // Source statements and CSS are separately required to match byte for byte.
 return {identical:false,match:fraction<=.0001,differentPixels,fraction};
}
