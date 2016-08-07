import expect from 'expect'
import Promise from 'bluebird'
import ActionTypes from '../../../src/actions/types'
import userReducer from '../../../src/reducers/userReducer'

describe('userReducer tests', () => {
    it('should handle initial state', () => {
        let state = userReducer(undefined, undefined);
        expect(state.profile).toNotExist();
        expect(state.isLoggedIn).toBe(false);
        expect(state.err).toNotExist();
    });

    it('should not change state for unknown action', () => {
        let prevState = {}
        let state = userReducer(prevState, 'UNKNOWN');
        expect(state).toBe(prevState);
    });

    it('should handle SIGNEDIN', () => {
        let expectedProfile = {test: true}
        let action = {
            type: ActionTypes.Auth.SignedIn,
            profile: expectedProfile
        }
        let state = userReducer({}, action);
        expect(state.profile).toEqual(expectedProfile);
        expect(state.isLoggedIn).toBe(true);
        expect(state.err).toNotExist();
    });

    it('should handle SIGNINERROR', () => {
        let expectedErr = 'sign in failure';
        let action = {
            type: ActionTypes.Auth.SignInError,
            err: expectedErr
        }
        let state = userReducer({}, action);
        expect(state.profile).toNotExist();
        expect(state.isLoggedIn).toBe(false);
        expect(state.err).toEqual(expectedErr);
    });

    it('should handle SIGNEDOUT', () => {
        let action = {
            type: ActionTypes.Auth.SignedOut,
            profile: null
        }
        let state = userReducer({}, action);
        expect(state.profile).toNotExist();
        expect(state.isLoggedIn).toBe(false);
        expect(state.err).toNotExist();
    });
});
