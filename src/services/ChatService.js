import { collection, addDoc, query, where, getDocs, orderBy,onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

export const createMessage = async (message, chatId, userId, userName) => {
  try {
    await addDoc(collection(db, "Messages"), {
      chatId: chatId,       // ID del chat, normalmente el UID del candidato
      content: message,     // El contenido del mensaje
      senderId: userId,     // UID del usuario que envía el mensaje
      senderName: userName, // Nombre del usuario que envía el mensaje
      timestamp: new Date()// Timestamp para ordenar los mensajes
    });
    console.log("Mensaje guardado exitosamente");
  } catch (error) {
    console.error("Error al enviar el mensaje: ", error);
  }
};
// Escuchar mensajes sin aplicar orderBy hasta que haya mensajes
export const listenForMessages = (chatId, setMessages) => {
  const q = query(collection(db, "Messages"), where("chatId", "==", chatId));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ ...doc.data(), id: doc.id });
    });

    if (messages.length > 0) {
      // Si hay mensajes, ordenar por timestamp
      const orderedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);
      setMessages(orderedMessages);
    } else {
      setMessages(messages);
    }
  });

  return unsubscribe;
};