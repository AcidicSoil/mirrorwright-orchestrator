import { validate } from '../../../tools/validateProtocol';

async function testValidator() {
  try {
    // Test with a valid protocol
    const validResult = await validate('tests/fixtures/valid/protocols/default-protocol.yaml', 'protocol');
    console.log('Valid protocol result:', validResult);

    // Test with an invalid protocol
    const invalidResult = await validate('tests/fixtures/invalid/protocols/missing-required-fields.yaml', 'protocol');
    console.log('Invalid protocol result:', invalidResult);

    // Test with a valid mode
    const validModeResult = await validate('tests/fixtures/valid/modes/meta-thinking.yaml', 'mode');
    console.log('Valid mode result:', validModeResult);

    // Test with an invalid mode
    const invalidModeResult = await validate('tests/fixtures/invalid/mode/missing-required.yaml', 'mode');
    console.log('Invalid mode result:', invalidModeResult);

    // Test with a valid ritual
    const validRitualResult = await validate('tests/fixtures/valid/rituals/init-reflection.yaml', 'ritual');
    console.log('Valid ritual result:', validRitualResult);

    // Test with an invalid ritual
    const invalidRitualResult = await validate('tests/fixtures/invalid/rituals/invalid-step-type.yaml', 'ritual');
    console.log('Invalid ritual result:', invalidRitualResult);
  } catch (error) {
    console.error('Error:', error);
  }
}

testValidator();
