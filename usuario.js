var api_url = 'http://localhost:8000/api/v1/usuarios';


//funcao para pegar todos
function get_all(){
   //Fetch metodo JavaScript para acessar e manipular HTTP, tais como os pedidos e respostas.
   fetch(api_url)


   .then(response => response.text())
   .then(function(text) {
   //variavel body acessando o documento, html manipulando tag tbodyalunos
     let tbody = document.getElementById('tbody-usuarios');
   //variavel let dados convertendo text para json
     let dados = JSON.parse(text);
   //tbody innerHtml recebe uma lista vazia
     tbody.innerHTML = '';

   //variavel dados que recebe o nosso texte entra em um foreach
   //criamos variavel de aluno
     dados.forEach(usuario => {
       //tbody inner html incrementando dados convertidos para incrementar nos hmtl
       tbody.innerHTML += ` <tr>
           <td>${usuario.id}</td>
           <td>${usuario.usuario}</td>
           <td>${usuario.email}</td>
           <td>
               <a href="save.html?id=${usuario.id}">editar</a> |
               <button onclick='remove(${usuario.id})'>deletar</button>
           </td>
       </tr>
       `;
     });
   });
}


//Buscar por usuario
function search(){
   //variavel id usuario acessando documento html acessando campo idbuscae seu valor
   let id_usuario = document.getElementById('id-busca').value;
   //imprimindo id_usuario
   console.log(id_usuario)
   // se id usuario for diferente de vazio
   if(id_usuario != ''){
       //acesse api url da nossa string
       api_url = `${api_url}/${id_usuario}`
   }
   else{
       return;
   }


   fetch(api_url)
   .then(response => response.text())
   .then(function(text) {
     let tbody = document.getElementById('tbody-usuarios');     
     let usuario = JSON.parse(text);
     console.log(usuario);    
     
     tbody.innerHTML = ` <tr>
       <td>${usuario.id}</td>
       <td>${usuario.usuario}</td>
       <td>${usuario.email}</td>
       <td>
           <a href="save.html?id=${usuario.id}">editar</a> |
           <button onclick='remove(${usuario.id})'>deletar</button>
       </td>
     </tr>`;
   });
}

// ela realiza uma busca de usuario por id e retorna usuario Json
function get_by_id(id_usuario){
   let usuario = fetch(`${api_url}/${id_usuario}`)
   .then(response => response.text())
   .then(function(text) {    
     return JSON.parse(text);
   });   
   return usuario;
}


function load_aluno(id_usuario){
   get_by_id(id_usuario).then(usuario =>{
       document.getElementById("id").value = usuario.id;
       document.getElementById("usuario").value = usuario.usuario;
       document.getElementById("email").value = usuario.email;
   });
 
}



//Botao salvar tanto para criar quanto editar
function save(){
   let id = document.getElementById("id").value;
   let usuario = document.getElementById("usuario").value;
   let email = document.getElementById("email").value;
      
   if(id != ''){
       console.log('editar')
       usuario = {"id":id, "usuario": usuario, "email": email}
       update(usuario);
   }
   else{
       usuario = {"usuario": usuario, "email": email}
       create(usuario);
   }       
}


function update(usuario){
   let mensagem = document.getElementById("mensagem");
   fetch(`${api_url}/${usuario.id}`,{
       method: 'PUT',
       headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
       },
       body: JSON.stringify(usuario)
   })
   .then(response => {
       if(response.status == 202){
           mensagem.innerHTML = "Alterado com sucesso";
       }else{
           mensagem.innerHTML = "Erro";
       }
   })
}


function create(usuario){
   let mensagem = document.getElementById("mensagem");
   fetch(api_url,{
       method: 'POST',
       headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
       },
       body: JSON.stringify(usuario)
   })
   .then(response => {
       if(response.status == 201){
        
           mensagem.innerHTML = "Criado com sucesso";
       }else{
           mensagem.innerHTML = "Erro";
       }
   })
}






function remove(id){
   fetch(`${api_url}/${id}`,{
       method: 'DELETE',
       headers: {
           'Accept': 'application/json'
       }
   })
   .then(response => {
       if(response.status == 204){
           get_all();
       }else{
           alert("Erro");
       }
   })
}