import unittest
from pdf_scale import viewport
class ScaleTests(unittest.TestCase):
    def test_isotropic(self):
        v={'/BBox':[0,0,100,100],'/Measure':{'/X':[{'/U':'ft','/C':0.1}]}}
        self.assertEqual(viewport(v,0)['unitsPerCoordinate'],0.1)
        v['/Measure']['/Y']=[{'/U':'ft','/C':0.2}]
        self.assertEqual(viewport(v,0)['status'],'unsupported')
    def test_no_invention(self):
        for m in ({'/R':'1 inch = 10 feet'},{'/Subtype':'/GEO'},{'/X':[{'/U':'ft','/C':-1}]},{'/X':[{'/U':'furlong','/C':1}]}):
            self.assertEqual(viewport({'/BBox':[0,0,100,100],'/Measure':m},0)['status'],'unsupported')
    def test_reversed(self):
        self.assertEqual(viewport({'/BBox':[100,0,0,100]},0)['status'],'unsupported')
if __name__=='__main__':unittest.main()
