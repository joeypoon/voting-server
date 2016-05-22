import { expect } from 'chai';
import { List, Map, fromJS } from 'immutable';

import { setEntries, next, vote } from '../src/core';

describe('application logic', () => {

  describe('set entries', () => {

    it('adds the entries to the state', () => {
      const state = Map();
      const entries = List.of('Dogs', 'Cats')
      const nextState = setEntries(state, entries);
      expect(nextState).to.equal(fromJS({
        entries: [
          'Dogs',
          'Cats'
        ]
      }));
    });

    it('converts to immutable', () => {
      const state = Map();
      const entries = ['Dogs', 'Cats'];
      const nextState = setEntries(state, entries);
      expect(nextState).to.equal(fromJS({
        entries: ['Dogs', 'Cats']
      }));
    });

  });

  describe('next', () => {

    it('takes the next two entries under vote', () => {
      const state = fromJS({
        entries: ['Dogs', 'Cats', 'Bunnies']
      });
      const nextState = next(state);
      expect(nextState).to.equal(fromJS({
        vote: {
          pair: ['Dogs', 'Cats']
        },
        entries: ['Bunnies']
      }));
    });

    it('returns current vote winner to entries', () => {
      const state = fromJS({
        vote: {
          pair: ['Dogs', 'Cats'],
          tally: {
            'Dogs': 3,
            'Cats': 2
          }
        },
        entries: ['Bunnies']
      });
      const nextState = next(state);
      expect(nextState).to.equal(fromJS({
        vote: {
          pair: ['Bunnies', 'Dogs']
        },
        entries: []
      }));
    });

    it('returns pair when tied', () => {
      const state = fromJS({
        vote: {
          pair: ['Dogs', 'Cats'],
          tally: {
            'Dogs': 3,
            'Cats': 3
          }
        },
        entries: ['Bunnies']
      });
      const nextState = next(state);
      expect(nextState).to.equal(fromJS({
        vote: {
          pair: ['Bunnies', 'Dogs']
        },
        entries: ['Cats']
      }));
    });

    it('declares winner if only 1 entry', () => {
      const state = fromJS({
        vote: {
          pair: ['Dogs', 'Cats'],
          tally: {
            'Dogs': 3,
            'Cats': 2
          }
        },
        entries: []
      });
      const nextState = next(state);
      expect(nextState).to.equal(fromJS({
        winner: 'Dogs'
      }));
    });

  });

  describe('vote', () => {

    it('creates a tally', () => {
      const state = fromJS({
        vote: {
          pair: ['Dogs', 'Cats']
        }
      });
      const nextState = vote(state, 'Dogs');
      expect(nextState).to.equal(fromJS({
        vote: {
          pair: ['Dogs', 'Cats'],
          tally: {
            'Dogs': 1
          }
        }
      }));
    });

    it('adds to tally', () => {
      const state = fromJS({
        vote: {
          pair: ['Dogs', 'Cats'],
          tally: {
            'Dogs': 1
          }
        }
      });
      const nextState = vote(state, 'Dogs');
      expect(nextState).to.equal(fromJS({
        vote: {
          pair: ['Dogs', 'Cats'],
          tally: {
            'Dogs': 2
          }
        }
      }));
    });

  });

});
