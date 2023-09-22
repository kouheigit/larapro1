/*import data list*/
import React from 'react'
import ReactDOM from 'react-dom';
import Header from 'components/Compheader'
import Hero from 'components/Comphero'
import Footer from 'components/Compfooter'

export default function Compindex(){
    return (
        <div id="Compindex">
            <Header />
            <main>
                <Hero />
            </main>

            <Footer />
        </div>
    )
}

if (document.getElementById('Compindex')) {
    ReactDOM.render(<Compindex />, document.getElementById('Compindex'));
}
