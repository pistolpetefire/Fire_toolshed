"""Prints the independent Python NFPA 68-2023 reference values (validation/verify/deflagration_vent.py) as JSON."""
import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'validation', 'verify'))
import deflagration_vent as dv
out = {
    'propane_721': dv.gas(10, 1.5, 0.46, 0.1, 0.5, 7.9)[0],
    'propane_722': dv.gas(10, 3, 0.46, 0.1, 1.0, 7.9)[0],
    'aluminum': dv.dust(10, 400, 0.1, 0.5, 11.2),
    'dust_compact': dv.dust(10, 200, 0.1, 0.5, 8),
    'dust_elongated': dv.dust(25, 150, 0.1, 0.4, 8, 4),
    'methane_722': dv.gas(50, 1, 0.40, 0.2, 1.0, 7.1)[0],
}
print(json.dumps(out))
