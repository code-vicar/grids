import React from 'react'
import { Link } from 'react-router'

export default class Header extends React.Component {
    render() {
        return (
            <div>
                <Link to="/">The Scene</Link>
                <Link to="/other">Test Routing</Link>
            </div>
        )
    }
}
