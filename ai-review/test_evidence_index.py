import unittest
from evidence_index import verify_quotes
class EvidenceTests(unittest.TestCase):
 def test_quote_states(self):
  index={'pages':[{'documentId':'D1','page':1,'text':'Pump rating\n750 gpm'},{'documentId':'D1','page':2,'text':''}]}
  claims=[{'documentId':'D1','page':1,'quote':'rating 750 gpm'},{'documentId':'D1','page':1,'quote':'1000 gpm'},{'documentId':'D1','page':2,'quote':'750'},{'documentId':'D1','page':3,'quote':'750'}]
  self.assertEqual([c['verification'] for c in verify_quotes(index,claims)['claims']],['text match','not found in extracted text','visual verification required','unknown page'])
if __name__=='__main__':unittest.main()
