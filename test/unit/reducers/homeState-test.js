import Promise from 'bluebird'
import ActionTypes from '../../../src/actions/types'
import homeState from '../../../src/reducers/homeState'
import expect from 'expect'

describe('homeState tests', () => {
    it('should handle initial state', () => {
        let state = homeState(undefined, undefined);
        expect(state.challenges).toBeAn(Array);
        expect(state.challenges.length).toBe(0);
    });

    it('should not change state for unknown action', () => {
        let prevState = {}
        let state = homeState(prevState, 'UNKNOWN');
        expect(state).toBe(prevState);
    });

    it('should handle ' + ActionTypes.Home.ChallengeAdded, () => {
        let action = {
            type: ActionTypes.Home.ChallengeAdded,
            challenge: {
                title: 'cool challenge yo'
            }
        }
        let state = homeState({challenges: []}, action);
        expect(state.challenges).toBeAn(Array);
        expect(state.challenges.length).toBe(1);
        expect(state.challenges[0]).toBe(action.challenge);
    });

    it('should handle ' + ActionTypes.Home.ChallengesReset, () => {
        let action = {
            type: ActionTypes.Home.ChallengesReset
        }
        let state = homeState({challenges: [
            {one: 1},
            {one: 2},
            {one: 3}
        ]}, action);

        expect(state.challenges).toBeAn(Array);
        expect(state.challenges.length).toBe(0);
    });
});
