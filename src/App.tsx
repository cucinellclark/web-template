import './App.css'
import HeaderBar from './HeaderBar'

function App() {
  return (
    <>
      <HeaderBar />
      <main className="main-content">
        <section className="section-top">
          <h3>Top Section</h3>
          <p>This is the top section content area.</p>
        </section>
        <section className="section-left">
          <h3>Left Section</h3>
          <p>This is the left section content area.</p>
        </section>
        <section className="section-middle">
          <h3>Middle Section</h3>
          <p>This is the central content area.</p>
        </section>
        <section className="section-right">
          <h3>Right Section</h3>
          <p>This is the right section content area.</p>
        </section>
        <section className="section-bottom">
          <h3>Bottom Section</h3>
          <p>This is the bottom section content area.</p>
        </section>
      </main>
    </>
  )
}

export default App
