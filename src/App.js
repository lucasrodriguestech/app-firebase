import { db, auth } from './firebaseConnection';
import { useState, useEffect } from 'react';
import './app.css'
import { 
  doc,
  setDoc, 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
 } from 'firebase/auth';


function App() {

  const [ titulo, setTitulo ] = useState('');
  const [ autor, setAutor ] = useState('');
  const [posts, setPosts] = useState([]);
  const [idPost, setIdPost] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({})

  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = [];

      snapshot.forEach((doc) => {
        listaPost.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
        })
      })

      setPosts(listaPost);
    
      })
    }

    loadPosts();
  }, [])

  useEffect(() => {
    async function checkLogin() {
      onAuthStateChanged(auth, (user) => {
        if(user){
          console.log(user);
          setUser(true);
          setUserDetail({
            uid: user.uid,
            email: user.email
          })
        }else{
          setUser(false);
          setUserDetail({})
        }
      })
    }
    checkLogin();
  }, [])

  async function handleAdd () {
    /* await setDoc(doc(db, "posts", "12345"), {
      titulo: titulo,
      autor: autor,
    })
    .then(() => {
      console.log("dados salvos no banco")
    })
    .catch((error) => {
      console.log("gerou erro" + error)
    }) */
  
  await addDoc(collection(db, "posts"), {
    titulo: titulo,
    autor: autor,
  }) 
  .then(() => {
    console.log("dados salvos no banco")
    setAutor('');
    setTitulo('');
  })
  .catch((error) => {
    console.log("gerou erro" + error)
  })
  } 

  async function buscarPost() {
    /* const postRef = doc(db, "posts" , "12345")

    await getDoc(postRef)
    .then((snapshot) => {
      setAutor(snapshot.data().autor)
      setTitulo(snapshot.data().titulo)
    })
    .catch(() => {
      console.log("error ao buscar")
    }) */
    
    const postsRef = collection(db, "posts")
    await getDocs(postsRef)
    .then((snapshot) => {
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
        })
      })

      setPosts(lista);
    })
    .catch((error) => {
      console.log("Deu algum erro")
    })
  }

  async function editarPost() {
    const docRef = doc(db, "posts", idPost)
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor,
    })
    .then(() => {
      console.log('Post atualizado');
      setIdPost('');
      setTitulo('');
      setAutor('');
    })
    .catch(() => {
      console.log("Erro ao atualizar o post")
    }) 
  }

  async function excluirPost(id){
    const docRef = doc(db, "posts" , id)
    await deleteDoc(docRef)
    .then(() => {
        console.log('Post deletado com sucesso')
    })
    .catch(() => {
        console.log("Houve um erro ao excluir o post")
    })
  }

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
    .then((value) => {
      console.log("Cadastrado com sucesso")
      setEmail('')
      setSenha('')
    })
    .catch((error) => {
     if(error.code === 'auth/weak-password'){
      alert("Senha muito fraca")
     }else if(error.code === 'auth/email-already-in-use'){
      alert("Email já existe")
     }
    })
  }

  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
    .then((value) => {
      console.log("Usuário logado com sucesso")

      setUserDetail({
        uid: value.user.uid,
        email: value.user.email,
      })

       setUser(true);

      setEmail('')
      setSenha('')
    })
    .catch(() => {
      console.log("Erro ao logar usuário")
    })
  }

  async function deslogarUsuario(){
    await signOut(auth)
    setUser(false);
    setUserDetail({})
  }
  
  return (
    <div className="App">
        <h1>ReactJs + FIrebase</h1>

      {user && (
        <div>
          <strong>Seja bem vindo(a) (Você está logado!)</strong>
          <span>ID: {userDetail.uid} - Email: {userDetail.email}</span> <br/>
          <button onClick={deslogarUsuario}>Deslogar</button>
        </div>
      )}

        
        <div className='container'>
          <h2>Usuários</h2>
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Digite seu email'
          />

        <label>Senha</label>
          <input
            type='password'
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder='Digite sua senha'
          />
          <button onClick={novoUsuario}>Cadastrar</button>
          <button onClick={logarUsuario}>Fazer Login</button>
        </div>

        <br/><br/>
        <hr/>
        <br/>

        <div className='container'>
        <h2>Posts</h2>
        <label>ID do Post:</label>
          <input
            
            placeholder='Digite ID do Post'
            value={idPost}
            onChange={(e) => setIdPost(e.target.value)}
          /> <br/>

          <label>Titulo</label>
          <textarea
            type="text"
            placeholder='Digite o título'
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <label>Autor:</label>
          <input
            type='text'
            placeholder='Autor do post'
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
          />

          <button onClick={handleAdd}>Cadastrar</button>
          <button onClick={buscarPost}>Buscar post</button> <br/>

          <button onClick={editarPost}>Atualizar post</button>

          <ul>
            {posts.map((post) => {
              return (
                <li key={post.id}>
                  <strong>ID: {post.id}</strong> <br/>
                  <span>Titulo: {post.titulo} </span> <br/>
                  <span>Autor: {post.autor}</span> <br/>
                  <button onClick={() => excluirPost(post.id)} >Excluir</button> <br/>
                  
                </li>
              )
            })}
          </ul>
        </div>
    </div>
  );
}

export default App;
