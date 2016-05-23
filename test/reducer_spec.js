import { expect } from 'chai';
import { Map, fromJS } from 'immutable';

import reducer from '../src/reducer';

describe('reducer', () => {

  it('handles SET_ENTRIES', () => {
    const initialState = Map();
    const action = { type: 'SET_ENTRIES', entries: ['Dogs'] };
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      entries: ['Dogs']
    }));
  });

  it('handles NEXT', () => {
    const initialState = fromJS({
      entries: ['Dogs', 'Cats', 'Bunnies']
    });
    const action = { type: 'NEXT' };
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      vote: {
        pair: ['Dogs', 'Cats']
      },
      entries: ['Bunnies']
    }));
  });

  it('handles VOTE', () => {
    const initialState = fromJS({
      vote: {
        pair: ['Dogs', 'Cats']
      },
      entries: ['Bunnies']
    });
    const action = { type: 'VOTE', entry: 'Dogs' };
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      vote: {
        pair: ['Dogs', 'Cats'],
        tally: {
          'Dogs': 1
        }
      },
      entries: ['Bunnies']
    }));
  });

  it('has an initial state', () => {
    const action = { type: 'SET_ENTRIES', entries: ['Dogs'] };
    const nextState = reducer(undefined, action);

    expect(nextState).to.equal(fromJS({
      entries: ['Dogs']
    }));
  });

  it('can be used with reduce', () => {
    const actions = [
      {type: 'SET_ENTRIES', entries: ['Dogs', 'Cats']},
      {type: 'NEXT'},
      {type: 'VOTE', entry: 'Dogs'},
      {type: 'VOTE', entry: 'Cats'},
      {type: 'VOTE', entry: 'Dogs'},
      {type: 'NEXT'}
    ];
    const finalState = actions.reduce(reducer, Map());

    expect(finalState).to.equal(fromJS({
      winner: 'Dogs'
    }));
  });

});
