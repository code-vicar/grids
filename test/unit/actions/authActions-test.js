import Promise from 'bluebird'
import expect from 'expect'

import ActionTypes from '../../../src/actions/types'

const proxyquire = require('proxyquire').noCallThru()

describe('authActions tests', () => {
    let mockDispatcher;
    beforeEach(() => {
        mockDispatcher = expect.createSpy();
    });

    describe('Initial state', () => {
        let authData = { token: "TOKEN", profile: { test: "TEST" } };
        let mockAuthServiceWithState;
        let mockAuthServiceWithoutState;
        beforeEach(() => {
            mockAuthServiceWithState = {
                getAuthData: expect.createSpy().andReturn({ token: "TOKEN", profile: { test: "TEST" } })
            }
            mockAuthServiceWithoutState = {
                getAuthData: expect.createSpy().andReturn(null)
            }
        });

        it('should get initial state from authService', () => {
            let authActions = proxyquire('../../../src/actions/authActions', {
                '../services/authService': mockAuthServiceWithState
            }).default

            let thunk = authActions.setInitialAuthState();
            thunk(mockDispatcher)
            expect(mockAuthServiceWithState.getAuthData).toHaveBeenCalled();

            expect(mockDispatcher.calls[0].arguments[0]).toInclude({
                type: ActionTypes.Auth.SignedIn,
                profile: authData.profile
            })
        });

        it('should dispatch a SIGNEDIN action if previous state exists', (done) => {
            let authActions = proxyquire('../../../src/actions/authActions', {
                '../services/authService': mockAuthServiceWithState
            }).default

            let thunk = authActions.setInitialAuthState()
            let authData = thunk(mockDispatcher);
            expect(mockDispatcher).toHaveBeenCalled();
            let action = mockDispatcher.calls[0].arguments[0];
            expect(action.type).toEqual(ActionTypes.Auth.SignedIn);
            done();
        });

        it('should dispatch a SIGNEDOUT action if no previous state exists', (done) => {
            let authActions = proxyquire('../../../src/actions/authActions', {
                '../services/authService': mockAuthServiceWithoutState
            }).default

            let thunk = authActions.setInitialAuthState()
            let authData = thunk(mockDispatcher);
            expect(mockDispatcher).toHaveBeenCalled();
            let action = mockDispatcher.calls[0].arguments[0];
            expect(action.type).toEqual(ActionTypes.Auth.SignedOut);
            done();
        });

    });

    describe('Sign In', () => {
        let mockAuthServiceSuccess;
        let mockAuthServiceFailure;
        beforeEach(() => {
            mockAuthServiceSuccess = {
                signIn: expect.createSpy(() => {
                    return Promise.resolve({
                        profile: {}
                    })
                }).andCallThrough()
            }
            mockAuthServiceFailure = {
                signIn: expect.createSpy(() => {
                    return Promise.reject(new Error('err'))
                }).andCallThrough()
            }
        });

        it('should call sign in on authService', (done) => {
            let authActions = proxyquire('../../../src/actions/authActions', {
                '../services/authService': mockAuthServiceSuccess
            }).default

            let thunk = authActions.startSignIn()
            thunk(mockDispatcher).then((profile) => {
                expect(mockAuthServiceSuccess.signIn).toHaveBeenCalled();
            }).then(done).catch(done)
        });

        it('should dispatch a SIGNEDIN action on success', (done) => {
            let authActions = proxyquire('../../../src/actions/authActions', {
                '../services/authService': mockAuthServiceSuccess
            }).default

            let thunk = authActions.startSignIn()
            thunk(mockDispatcher).then((profile) => {
                expect(mockDispatcher).toHaveBeenCalled();
                let action = mockDispatcher.calls[0].arguments[0];
                expect(action.type).toEqual(ActionTypes.Auth.SignedIn);
            }).then(done).catch(done)
        });

        it('should dispatch a SIGNINERROR action on failure', (done) => {
            let authActions = proxyquire('../../../src/actions/authActions', {
                '../services/authService': mockAuthServiceFailure
            }).default

            let thunk = authActions.startSignIn()
            thunk(mockDispatcher).then((profile) => {
                expect(mockDispatcher).toHaveBeenCalled();
                let action = mockDispatcher.calls[0].arguments[0];
                expect(action.type).toEqual(ActionTypes.Auth.SignInError);
            }).then(done).catch(done)
        });
    });

    describe('Sign Out', () => {
        let mockAuthService;
        beforeEach(() => {
            mockAuthService = {
                signOut: expect.createSpy().andReturn(Promise.resolve())
            }
        });

        it('should call sign out on authService', (done) => {
            let authActions = proxyquire('../../../src/actions/authActions', {
                '../services/authService': mockAuthService
            }).default

            let thunk = authActions.signOut()
            thunk(mockDispatcher).then(() => {
                expect(mockAuthService.signOut).toHaveBeenCalled();
            }).then(done).catch(done)
        });


        it('should dispatch a SIGNEDOUT action', (done) => {
            let authActions = proxyquire('../../../src/actions/authActions', {
                '../services/authService': mockAuthService
            }).default

            let thunk = authActions.signOut()
            thunk(mockDispatcher).then(() => {
                expect(mockDispatcher).toHaveBeenCalled();
                let action = mockDispatcher.calls[0].arguments[0];
                expect(action.type).toEqual(ActionTypes.Auth.SignedOut);
            }).then(done).catch(done)
        });
    });
});
