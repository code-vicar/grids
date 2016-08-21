import React from 'react'

export default class LoadingError extends React.Component {
    render() {
        return (
            <section>
                <header>Error loading game</header>
                <p>{this.props.errors}</p>
            </section>
        )
    }
}
