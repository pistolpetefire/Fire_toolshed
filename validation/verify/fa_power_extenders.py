"""FA Power Extenders: engine checks worked independently in Python.
Wire resistance: NEC Chapter 9 Table 8, uncoated stranded copper, ohm/kft at 75 C: 18 AWG 7.95, 16 AWG 4.99, 14 AWG 3.14, 12 AWG 1.98.
Voltage drop (two-wire DC): VD = 2 I R L_eff, L_eff = placement factor x one-way length (Class B; end 1.0, distributed 0.5, start 0.15,
the app's stated lumped-load factors); Class A adds the return run.
Battery: Ah = (I_standby x standby h + I_alarm x alarm min / 60) x 1.25 aging x temp x 1.2 spare (app stated factors);
NFPA 72 secondary supply: 24 h standby then 5 min alarm (15 min with voice evacuation).
Speakers: I = W / V (25 V or 70.7 V)."""
from ftverify import write, r
R = {18: 7.95, 16: 4.99, 14: 3.14, 12: 1.98}
E = 'FAPowerEngine.'
def vd(I, L, awg, place=1.0, ret=None):
    Le = place * L + (ret if ret is not None else 0)
    return 2 * I * R[awg] / 1000 * Le
cases = [
    {'id': 'vd-end-14', 'title': 'Class B, 2.0 A, 300 ft one-way, 14 AWG, load at end', 'source': 'NEC Ch. 9 Table 8; Ohm\'s law',
     'reads': [{'expr': E + "voltageDropV({currentA:2,oneWayFt:300,awg:14,classType:'B',placement:'end'})", 'label': 'Voltage drop', 'unit': 'V', 'ref': r(vd(2, 300, 14))},
               {'expr': E + "lastDeviceVoltage({sourceV:20.4,currentA:2,oneWayFt:300,awg:14,classType:'B',placement:'end'})", 'label': 'Last-device voltage from 20.4 V', 'unit': 'V', 'ref': r(20.4 - vd(2, 300, 14))}]},
    {'id': 'vd-dist-16', 'title': 'Class B, 1.6 A, 450 ft one-way, 16 AWG, distributed load', 'source': 'NEC Ch. 9 Table 8; lumped factor 0.5',
     'reads': [{'expr': E + "voltageDropV({currentA:1.6,oneWayFt:450,awg:16,classType:'B',placement:'distributed'})", 'label': 'Voltage drop', 'unit': 'V', 'ref': r(vd(1.6, 450, 16, 0.5))}]},
    {'id': 'vd-classA-12', 'title': 'Class A, 2.5 A, 400 ft out + 400 ft return, 12 AWG, end', 'source': 'NEC Ch. 9 Table 8',
     'reads': [{'expr': E + "voltageDropV({currentA:2.5,oneWayFt:400,returnFt:400,awg:12,classType:'A',placement:'end'})", 'label': 'Voltage drop', 'unit': 'V', 'ref': r(vd(2.5, 400, 12, 1.0, 400))}]},
    {'id': 'nac-current', 'title': '12 strobes at 0.110 A + 6 horn/strobes at 0.145 A', 'source': 'Sum of device currents',
     'reads': [{'expr': E + "circuitCurrentA({kind:'nac',devices:[{qty:12,currentA:0.110},{qty:6,currentA:0.145}]})", 'label': 'Circuit current', 'unit': 'A', 'ref': r(12 * 0.110 + 6 * 0.145)}]},
    {'id': 'speaker-current', 'title': '70.7 V circuit, 20 speakers at 1 W + 10 at 2 W', 'source': 'I = W / V',
     'reads': [{'expr': E + "circuitCurrentA({kind:'audio',audioV:70.7,devices:[{qty:20,tapW:1},{qty:10,tapW:2}]})", 'label': 'Speaker circuit current', 'unit': 'A', 'ref': r(40 / 70.7)}]},
    {'id': 'battery-nfpa', 'title': 'Battery, 0.25 A standby 24 h, 4.5 A alarm 5 min', 'source': 'NFPA 72 durations; app factors 1.25 x 1.2',
     'reads': [{'expr': E + "batteryAh({iStandby:0.25,iAlarm:4.5,standbyH:24,alarmMin:5}).requiredAh", 'label': 'Required battery capacity', 'unit': 'Ah', 'ref': r((0.25 * 24 + 4.5 * 5 / 60) * 1.25 * 1.2)},
               {'expr': E + "durations('nfpa72',{hasAudio:true}).alarmMin", 'label': 'Voice-evac alarm duration', 'unit': 'min', 'ref': 15}]},
]
write('fa-power-extenders', {'script': 'fa_power_extenders.py', 'app': 'FA Power Extenders', 'versionSel': '#appVersion',
      'handcalc': 'validation/verify/fa_power_extenders.py',
      'flags': ['Review note, not a math error: the UFC standby duration (60 h) and UFC 4-021-01 MNS 60 min alarm were not independently confirmed here; '
                'UFC 4-021-01 text found cites 72 h supervision for HPSA batteries. Confirm per project and AHJ.'], 'cases': cases})
