import Promise from 'bluebird'
import expect from 'expect'

import ActionTypes from '../../../src/actions/types'

const proxyquire = require('proxyquire')

describe('homeActions tests', () => {
    let mockDispatcher;

    beforeEach(() => {
        mockDispatcher = expect.createSpy();
    });

    describe('Firebase connection', () => {
        let mockFirebaseRef;
        let mockFirebase;

        beforeEach(() => {
            mockFirebaseRef = {
                child: expect.createSpy()
            }
            mockFirebase = expect.createSpy().andReturn(mockFirebaseRef)
        })

        it('should create firebaseRef with FIREBASE_ROOT_URL', () => {
            let FIREBASE_ROOT_URL = 'test_firebase_url';
            proxyquire('../../../src/actions/homeActions', {
                'firebase': mockFirebase,
                '../settings/index': {
                    FIREBASE_ROOT_URL
                }
            })

            expect(mockFirebase).toHaveBeenCalledWith(FIREBASE_ROOT_URL)
        })

        it('should set ref to query challenges collection', () => {
            proxyquire('../../../src/actions/homeActions', {
                'firebase': mockFirebase
            })

            expect(mockFirebaseRef.child).toHaveBeenCalledWith('challenges')
        })
    })

    describe('startChallengeListener', () => {
        let mockFirebaseRefChild;
        let mockFirebaseRef;
        let mockFirebase;
        let homeActions;

        beforeEach(() => {
            mockFirebaseRefChild = {
                on: expect.createSpy()
            }
            mockFirebaseRef = {
                child: expect.createSpy().andReturn(mockFirebaseRefChild)
            }
            mockFirebase = expect.createSpy().andReturn(mockFirebaseRef)
            homeActions = proxyquire('../../../src/actions/homeActions', {
                'firebase': mockFirebase
            }).default
        })

        it('should call invoke ref.on with \'child_added\'', () => {
            let thunk = homeActions.startChallengeListListener()
            thunk(mockDispatcher)
            expect(mockFirebaseRefChild.on.calls[0].arguments[0]).toBe('child_added')
        })
    });

    describe('stopChallengeListener', () => {
        let mockFirebaseRefChild;
        let mockFirebaseRef;
        let mockFirebase;
        let homeActions;

        beforeEach(() => {
            mockFirebaseRefChild = {
                off: expect.createSpy()
            }
            mockFirebaseRef = {
                child: expect.createSpy().andReturn(mockFirebaseRefChild)
            }
            mockFirebase = expect.createSpy().andReturn(mockFirebaseRef)
            homeActions = proxyquire('../../../src/actions/homeActions', {
                'firebase': mockFirebase
            }).default
        })

        it('should call invoke ref.off with \'child_added\'', () => {
            let thunk = homeActions.stopChallengeListListener()
            thunk(mockDispatcher)
            expect(mockFirebaseRefChild.off).toHaveBeenCalledWith('child_added')
        })
    });
});
