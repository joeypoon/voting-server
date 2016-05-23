import { List, Map } from 'immutable';

export const INITIAL_STATE = Map();

export function setEntries(state, entries) {
  return state.set('entries', List(entries));
}

function getWinners(vote) {
  if (!vote) return [];
  const [a, b] = vote.get('pair');
  const aTally = vote.getIn(['tally', a], 0);
  const bTally = vote.getIn(['tally', b], 0);
  if (aTally > bTally) return List.of(a);
  else if (bTally > aTally) return List.of(b);
  else return List.of(a, b);
}

function isLastEntry(state) {
  const entries = state.get('entries').size;
  if (!entries) {
    return true
  } else {
    return false
  }
}

export function next(state) {
  const entries = state.get('entries').concat(getWinners(state.get('vote')));
  if (entries.size === 1) {
    return state.remove('vote')
                .remove('entries')
                .set('winner', entries.first())
  } else {
    return state.merge({
      vote: Map({ pair: entries.take(2) }),
      entries: entries.skip(2)
    });
  }
}

export function vote(voteState, entry) {
  return voteState.updateIn(
    ['tally', entry], //path to navigate
    0, //initial value if none
    tally => tally + 1 //take value at path and return + 1
  );
}
