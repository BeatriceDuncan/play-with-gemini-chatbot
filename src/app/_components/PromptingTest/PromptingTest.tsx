import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY!)

const PromptingTest = () => {
  return (<>      <h2 className={styles.title}>Gemini Chatbot</h2>
      <Paper elevation={3} className={styles.container}></>)
}

export default PromptingTest
