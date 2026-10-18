import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DynamicPageSchema,
  TEST_LOCATORS,
  HomeFeedResponseSchema,
} from '../src/index';

test('Contracts Schema Validation: DynamicPageSchema validates valid SDUI page', () => {
  const samplePage = {
    pageId: 'page_medical_01',
    title: 'Patient Care & Medication',
    roles: [
      { id: 'primary', label: 'Patient', icon: 'heart' },
      { id: 'secondary', label: 'Caregiver', icon: 'shield' },
    ],
    sections: [
      {
        id: 'sec_vitals',
        title: 'Daily Adherence',
        layout: 'stack',
        components: [
          {
            id: 'comp_adherence_01',
            type: 'METRIC_CARD',
            props: {
              title: 'Metformin 500mg',
              value: 'Taken (08:30 AM)',
              status: 'success',
            },
            roleVisibility: ['primary', 'secondary'],
          },
        ],
      },
    ],
  };

  const parsed = DynamicPageSchema.safeParse(samplePage);
  assert.equal(parsed.success, true);
});

test('Contracts Schema Validation: TEST_LOCATORS are defined for all critical flows', () => {
  assert.ok(TEST_LOCATORS.NAV);
  assert.ok(TEST_LOCATORS.ROLES);
  assert.ok(TEST_LOCATORS.ADMIN);
  assert.ok(TEST_LOCATORS.RESPONSIVE);
});
