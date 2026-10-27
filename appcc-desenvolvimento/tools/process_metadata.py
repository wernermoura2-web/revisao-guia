"""Attach display codes and references without changing assessment keys or wording."""
import json
from pathlib import Path
def apply(cfg,root):
 review=json.loads((Path(root)/'responsibility-cp-review.json').read_text())
 for c in cfg['itens'].values():
  patch=review.get(c.get('rmId'))
  if not patch or c.get('cpReviewVersion')=='responsaveis-cp1362-20261027':continue
  for index,article in patch['refs'].items():
   f=c['frases'][int(index)];f['ref']+='; CP Anvisa 1362/2025 (proposta), '+article
  c['frases'].extend(json.loads(json.dumps(patch['add'])))
  c['cpReviewVersion']='responsaveis-cp1362-20261027'
 data=json.loads((Path(root)/'process-display-data.json').read_text())
 for c in cfg['itens'].values():
  m=data[str(c['page'])+':'+str(c['code'])];c['processId']=m['processId'];c['title']=m['title'];c['overviewRef']=m.get('overviewRef',m.get('baseRef',''))
  for f in c['frases']:
   if m.get('baseRef')and not f.get('ref'):f['ref']=m['baseRef']
 return cfg

def summary(c):
 return c['title']+' | Ref.: '+c.get('overviewRef','')
