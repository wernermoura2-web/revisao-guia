"""Ship one immutable version of the browser model, controls, styles and images."""
from pathlib import Path
import argparse,hashlib,json,re,shutil,subprocess
ROOT=Path(__file__).resolve().parents[1]
FILES=['storage-separation.js','config.js','paper-data-layout-v6.js','app.js','legal-documents.js','pcc-final.js','paper.js','backup.js','install.js']
def package(site):
 content={n:(site/n).read_text() for n in FILES}
 paper=json.loads(content['paper-data-layout-v6.js'].split('=',1)[1].strip().rstrip(';'))
 digest=hashlib.sha256(Path(__file__).read_bytes())
 for name in FILES+['style.css','paper.css']:
  digest.update(name.encode());digest.update((site/name).read_bytes())
 for p in paper:digest.update((site/p['image']).read_bytes())
 release=digest.hexdigest()[:16];folder=site/'assets'/release;folder.mkdir(parents=True,exist_ok=True)
 assets=[]
 for i,p in enumerate(paper):
  name=f'pagina-{i+1:02d}.webp';shutil.copyfile(site/p['image'],folder/name);p['image']=f'assets/{release}/{name}';assets.append(p['image'])
 content['paper-data-layout-v6.js']='const PAPER='+json.dumps(paper,ensure_ascii=False,separators=(',',':'))+';\n'
 runtime=f'assets/{release}/guia.js';css=f'assets/{release}/guia.css'
 (site/runtime).write_text('/* Immutable guide runtime '+release+' */\n'+'\n;\n'.join(content[n] for n in FILES)+'\n')
 (site/css).write_text((site/'style.css').read_text()+'\n'+(site/'paper.css').read_text())
 p=site/'html.appcc.pdf.html';html=p.read_text()
 html=re.sub(r'<script[^>]*src="assets/[a-f0-9]+/guia\.js"[^>]*></script>','',html)
 html=re.sub(r'<link[^>]*href="assets/[a-f0-9]+/guia\.css"[^>]*>','',html)
 html=re.sub(r'<script\b[^>]*src="(?:'+ '|'.join(re.escape(n) for n in FILES)+r')(?:\?[^"<>]*)?"[^>]*></script>','',html)
 html=re.sub(r'<link\b[^>]*href="(?:style\.css|paper\.css)(?:\?[^"<>]*)?"[^>]*>','',html)
 html=html.replace('</head>',f'<link rel="stylesheet" href="{css}"><script src="{runtime}" defer></script></head>')
 p.write_text(html)
 p=site/'sw-appcc.js';sw=(ROOT/'sw-appcc.js').read_text();sw=re.sub(r"const CACHE='[^']+'",f"const CACHE='guia-appcc-revisao-leg-runtime-{release}'",sw,1)
 sw=sw.replace("const FILES=[",'const FILES='+json.dumps([runtime,css,*assets],separators=(',',':'))+'.concat([',1).replace("'.webp')];","'.webp')]);",1)
 p.write_text(sw)
 manifest={'release':release,'runtime':runtime,'css':css,'images':assets,'pages':len(paper)};(site/'runtime-manifest.json').write_text(json.dumps(manifest,separators=(',',':')))
 assert len(paper)==22 and len(set(assets))==22
 assert all((site/n).exists() for n in [runtime,css,*assets])
 assert sum('guia.js' in x for x in re.findall(r'<script[^>]*src="([^"]+)"',html))==1
 assert not any(re.search(r'<script[^>]*src="'+re.escape(n),html) for n in FILES)
 subprocess.run(['node','--check',str(site/runtime)],check=True)
 subprocess.run(['node','--check',str(site/'sw-appcc.js')],check=True)
 print('Packaged immutable runtime',release,'with',len(paper),'pages')
 return manifest
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--site-root',required=True,type=Path);args=parser.parse_args();package(args.site_root)
