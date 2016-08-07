import React from 'react';
import expect from 'expect';
import createComponent from 'react-unit';

const proxyquire = require('proxyquire').noCallThru()

describe('Header tests', () => {
    let componentLoggedOut;
    let componentLoggedIn;
    let componentLoggedErr;

    let Header = proxyquire('../../../src/components/Header', {
        '../actions/authActions': {}
    }).Header

    beforeEach(() => {
        componentLoggedOut = createComponent.shallow(<Header/>);
        componentLoggedIn = createComponent.shallow(<Header isLoggedIn="true" profile={({nickname: 'Testerson'})} />);
        componentLoggedErr = createComponent.shallow(<Header err="WOAH AN ERROR" />);
    });

    it('should show logged out button when logged out', () => {
        let button = componentLoggedOut.findByQuery('RaisedButton')
        expect(button[0]).toExist();
        expect(button[0].props.label).toBe('you are not logged in');
    });

    it('should show logged in button with profile nickname', () => {
        let button = componentLoggedIn.findByQuery('RaisedButton')
        expect(button[0]).toExist();
        expect(button[0].props.label).toBe('you are logged in, Testerson');
    });

    it('should show an error when there is an error', () => {
        let err = componentLoggedErr.findByQuery('.error')
        expect(err[0]).toExist();
        expect(err[0].text).toBe('WOAH AN ERROR');
    });
});
