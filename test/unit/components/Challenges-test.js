import React from 'react'
import expect from 'expect'
import createComponent from 'react-unit'

import { Component as Challenges } from '../../../src/components/Challenges'

describe('Home <Challenges /> tests', () => {
    let challenges

    beforeEach(() => {
        challenges = createComponent.shallow(<Challenges />)
    })

    it('Should have title of \'Challenges\'', () => {
        let title = challenges.findByQuery('.challenges span')
        expect(title[0]).toExist()
        expect(title[0].text).toBe('Challenges')
    })

    describe('when there are no challenges', () => {
        let challenges

        beforeEach(() => {
            challenges = createComponent.shallow(<Challenges />)
        })

        it('should show an empty list ', () => {
            let list = challenges.findByQuery('ul')
            expect(list[0]).toExist()
            expect(list[0].children.length).toBe(0)
        })
    })

    describe('when there are challenges', () => {
        let challenges

        beforeEach(() => {
            challenges = createComponent.shallow(<Challenges challenges={([{id: 1, title: 'the best'}, {id: 2, title: 'around'}])} />)
        })

        it('should show an empty list ', () => {
            let list = challenges.findByQuery('ul')
            expect(list[0]).toExist()
            expect(list[0].children.length).toBe(2)
            let challengeOne = challenges.findByQuery('li[key=1]')
            expect(challengeOne[0]).toExist()
            expect(challengeOne[0].text).toBe('the best')
            let challengeTwo = challenges.findByQuery('li[key=2]')
            expect(challengeTwo[0]).toExist()
            expect(challengeTwo[0].text).toBe('around')
        })
    })
})
