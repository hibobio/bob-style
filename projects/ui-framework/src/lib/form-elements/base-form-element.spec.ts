import { BaseFormElement } from './base-form-element';
import {
  simpleChange,
  eventEmitterMock,
  changeDetectorMock,
} from '../services/utils/test-helpers';
import { InputEventType, FormEvents } from './form-elements.enum';
import { cloneObject } from '../services/utils/functional-utils';

describe('BaseFormElement', () => {
  let baseFormElement: BaseFormElement;
  const baseValue = 'Base value';
  const outTransAddedString = ' @$%';

  beforeEach(() => {
    baseFormElement = new (BaseFormElement as any)();

    baseFormElement.baseValue = baseValue;
    baseFormElement.doPropagate = true;
    baseFormElement.ignoreEvents = [];

    baseFormElement.inputTransformers = [
      (value: string): string => value.replace('ABC', 'DEF'),
      (value: string): string => value.replace('123', '456'),
    ];
    baseFormElement.outputTransformers = [
      (value: string): string => value.replace('DEF', 'ABC'),
      (value: string): string => value.replace('456', '123'),
    ];

    baseFormElement['focused'] = cloneObject(eventEmitterMock);
    baseFormElement['blurred'] = cloneObject(eventEmitterMock);
    baseFormElement['cd'] = cloneObject(changeDetectorMock);

    spyOn(baseFormElement.changed, 'emit');
    spyOn(baseFormElement['focused'], 'emit');
    spyOn(baseFormElement['blurred'], 'emit');
    spyOn(baseFormElement, 'propagateChange');
    spyOn(baseFormElement, 'onTouched');

    baseFormElement.changed.subscribe(() => {});
  });

  afterEach(() => {
    baseFormElement.changed.complete();
  });

  describe('WriteValue', () => {
    beforeEach(() => {
      baseFormElement.wrapEvent = false;
    });

    it('Should set value to input and emit change', () => {
      const testString = 'Some text';
      baseFormElement.ngOnChanges(
        simpleChange({
          value: testString,
        })
      );
      expect(baseFormElement.value).toEqual(testString);
    });

    it('Should emit/propagate change with input value', () => {
      const testString = 'Some text';
      baseFormElement.ngOnChanges(
        simpleChange({
          value: testString,
        })
      );
      expect(baseFormElement.changed.emit).toHaveBeenCalledWith(testString);
      expect(baseFormElement.propagateChange).toHaveBeenCalledWith(testString);
      expect(baseFormElement.onTouched).not.toHaveBeenCalled();
    });

    it('Should set value to baseValue if null or undefined input is passed', () => {
      const testString = undefined;

      baseFormElement.ngOnChanges(
        simpleChange({
          value: testString,
        })
      );
      expect(baseFormElement.value).toEqual(baseValue);
    });
  });

  describe('Transformers', () => {
    const testString = 'ABC TEST 123';

    beforeEach(() => {
      baseFormElement.wrapEvent = false;

      baseFormElement.outputTransformers.push(
        (value: string): string => value + outTransAddedString
      );

      baseFormElement.ngOnChanges(
        simpleChange({
          value: testString,
        })
      );
    });

    it('Should transform input value', () => {
      expect(baseFormElement.value).toEqual('DEF TEST 456');
    });

    it('Should transform output value', () => {
      expect(baseFormElement.changed.emit).toHaveBeenCalledWith(
        testString + outTransAddedString
      );
      expect(baseFormElement.propagateChange).toHaveBeenCalledWith(
        testString + outTransAddedString
      );
    });
  });

  describe('TransmitValue', () => {
    const testString = 'Some text';

    beforeEach(() => {
      baseFormElement.wrapEvent = true;
    });

    it('Should transmit event of particular type', () => {
      baseFormElement['transmitValue'](testString, {
        eventType: [InputEventType.onKey],
      });

      expect(baseFormElement.changed.emit).toHaveBeenCalledTimes(1);
      expect(baseFormElement.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onKey,
        value: testString,
      });
      expect(baseFormElement.propagateChange).toHaveBeenCalledWith(testString);
      expect(baseFormElement.onTouched).not.toHaveBeenCalled();
    });

    it('Should emit using particular eventEmitter', () => {
      baseFormElement['transmitValue'](testString, {
        eventType: [InputEventType.onChange],
        emitterName: FormEvents.focused,
      });

      expect(baseFormElement.changed.emit).not.toHaveBeenCalled();
      expect(baseFormElement['focused'].emit).toHaveBeenCalledTimes(1);
      expect(baseFormElement['focused'].emit).toHaveBeenCalledWith({
        event: InputEventType.onChange,
        value: testString,
      });
      expect(baseFormElement.propagateChange).toHaveBeenCalledWith(testString);
      expect(baseFormElement.onTouched).not.toHaveBeenCalled();
    });

    it('Should be able to emit multiple event types', () => {
      baseFormElement['transmitValue'](testString, {
        eventType: [InputEventType.onChange, InputEventType.onBlur],
      });

      expect(baseFormElement.changed.emit).toHaveBeenCalledTimes(2);
      expect(baseFormElement.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onChange,
        value: testString,
      });
      expect(baseFormElement.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onBlur,
        value: testString,
      });
      expect(baseFormElement.onTouched).toHaveBeenCalledTimes(1);
    });

    it('Should call onTouched if event type is onBlur', () => {
      baseFormElement['transmitValue'](testString, {
        eventType: [InputEventType.onBlur],
      });
      expect(baseFormElement.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onBlur,
        value: testString,
      });
      expect(baseFormElement.onTouched).toHaveBeenCalled();
    });

    it('Should add properties to emitted object', () => {
      baseFormElement['transmitValue'](testString, {
        eventType: [InputEventType.onChange],
        addToEventObj: {
          hello: 'world',
        },
      });
      expect(baseFormElement.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onChange,
        value: testString,
        hello: 'world',
      });
    });

    it('Should update value with (output-)transformed value, if updateValue option is true', () => {
      baseFormElement.value = testString;
      baseFormElement.outputTransformers.push(
        (value: string): string => value + outTransAddedString
      );

      baseFormElement['transmitValue']('DEF 456', {
        eventType: [InputEventType.onKey],
        updateValue: true,
      });

      expect(baseFormElement.value).toEqual('ABC 123' + outTransAddedString);
      expect(baseFormElement.changed.emit).toHaveBeenCalledWith({
        event: InputEventType.onKey,
        value: 'ABC 123' + outTransAddedString,
      });
    });

    it('Should not propagate if doPropagate options is false', () => {
      baseFormElement['transmitValue'](testString, {
        eventType: [InputEventType.onBlur],
        doPropagate: false,
      });
      expect(baseFormElement.changed.emit).toHaveBeenCalled();
      expect(baseFormElement.propagateChange).not.toHaveBeenCalled();
      expect(baseFormElement.onTouched).not.toHaveBeenCalled();
    });

    it('Should not transmit, if event type is in ignoreEvents array', () => {
      baseFormElement.ignoreEvents = [InputEventType.onWrite];

      baseFormElement['transmitValue'](testString, {
        eventType: [InputEventType.onWrite],
      });

      expect(baseFormElement.changed.emit).not.toHaveBeenCalled();
      expect(baseFormElement.propagateChange).not.toHaveBeenCalled();
    });
  });

  describe('Events', () => {
    const testString = 'Some text';

    beforeEach(() => {
      baseFormElement.wrapEvent = false;
    });

    it('should not emit event, if it has no observers', () => {
      baseFormElement.changed.complete();
      baseFormElement.ngOnChanges(
        simpleChange({
          value: testString,
        })
      );

      expect(baseFormElement.changed.emit).not.toHaveBeenCalled();
      expect(baseFormElement.propagateChange).toHaveBeenCalledWith(testString);
      expect(baseFormElement.onTouched).not.toHaveBeenCalled();
    });
  });
});
