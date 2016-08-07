import Promise from 'bluebird'
import expect from 'expect'

const proxyquire = require('proxyquire').noCallThru()

describe('authService tests', () => {
    let service;
    let mockFirebase;
    let mockAuth0Service;
    let mockStorageService;
    let AuthDataKey = 'MockAuthData'

    beforeEach(() => {
        mockAuth0Service = expect.createSpy().andReturn(Promise.resolve({token: 'TEST', profile: {}}))

        mockStorageService = {
            getObject: expect.createSpy().andReturn(null),
            setObject: expect.createSpy(),
            removeItem: expect.createSpy()
        }

        mockFirebase = expect.createSpy().andReturn({
            authWithCustomToken: expect.createSpy().andReturn(Promise.resolve())
        })

        service = proxyquire('../../../src/services/authService', {
            './auth0LockService': mockAuth0Service,
            './storageService': mockStorageService,
            'firebase': mockFirebase,
            '../settings/index': {
                AUTH_DATA_KEY: AuthDataKey
            }
        })
    })

    describe('get status', () => {
        it('should get status from storage service', () => {
            let authData = service.getAuthData();
            expect(mockStorageService.getObject).toHaveBeenCalledWith(AuthDataKey);
        });
    });

    describe('sign in', () => {
        it('should call show on Auth0 service', (done) => {
            service.signIn().then(() => {
                expect(mockAuth0Service).toHaveBeenCalled();
            }).then(done).catch(done)
        });

        it('should save auth data to storage service', (done) => {
            service.signIn().then(() => {
                expect(mockStorageService.setObject.calls[0].arguments[0]).toEqual(AuthDataKey)
            }).then(done).catch(done)
        });

        it('should reject if auth0lock service returns no authData', (done) => {
            let mockAuth0Service = expect.createSpy().andReturn(Promise.resolve())

            let service = proxyquire('../../../src/services/authService', {
                './auth0LockService': mockAuth0Service,
                './storageService': mockStorageService,
                'firebase': mockFirebase,
                '../settings/index': {
                    AUTH_DATA_KEY: AuthDataKey
                }
            })

            service.signIn().then(() => {
                throw new Error('should not succeed')
            }).catch((err) => {
                expect(err.message).toBe('Auth0 authentication failed')
            }).then(done).catch(done)
        });
    });

    describe('sign out', () => {
        it('should clear data from storage service', (done) => {
            service.signOut().then(() => {
                expect(mockStorageService.removeItem).toHaveBeenCalledWith(AuthDataKey);
            }).then(done).catch(done)
        });
    });
});
