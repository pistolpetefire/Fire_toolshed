import assert from 'node:assert/strict';
import {pressureBudget,storageDemand,occupantLoad,batteryCapacity,circuitVoltage} from './review-tools.mjs';
assert.equal(pressureBudget({availablePsi:100,requiredPsi:50,lossPsi:10,riseFt:100}).marginPsi,-3.299999999999997);
assert.equal(storageDemand({flowGpm:500,durationMinutes:60,unusableGallons:1000}).totalGallons,31000);
assert.equal(occupantLoad({areaSqFt:1001,factorSqFtPerPerson:100,areaBasis:'gross'}).occupants,11);
assert.equal(batteryCapacity({standbyAmps:1,standbyHours:24,alarmAmps:6,alarmMinutes:5,multiplier:1.2}).requiredAh,29.4);
assert.equal(circuitVoltage({sourceVolts:24,currentAmps:2,loopResistanceOhms:1.5}).endVolts,21);
assert.throws(()=>occupantLoad({areaSqFt:100,factorSqFtPerPerson:0,areaBasis:'net'}));assert.throws(()=>pressureBudget({availablePsi:100,requiredPsi:50,lossPsi:-1,riseFt:0}));
console.log('PASS pressure, storage, occupant load, battery capacity, circuit voltage and invalid inputs.');
