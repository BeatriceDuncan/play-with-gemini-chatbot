import Chatbot from "./_components/Chatbot/Chatbot"
import styles from "./page.module.css"

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Chatbot />
      </div>
    </main>
  )
}
