import Chatbot from "./_components/Chatbot/Chatbot"
import styles from "./index.module.css"

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Gemini Chatbot</h1>
        <Chatbot />
      </div>
    </main>
  )
}
