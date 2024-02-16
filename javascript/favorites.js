import { GithubUser } from "./GithubUser.js"
// classe que vai conter a lógica dos dados
// como os dados serão estruturados

export class Favorites {
    constructor(root) { //root é o .app
        this.root = document.querySelector(root) //só confirmando que quer o root.

        this.load()
        
    }

    load() { //entrada dos dados. localStorage armazena os dados
        this.entries = JSON.parse(localStorage.getItem //parse converte uma string para um objeto, facilitando para pegar os dados com .name .login
            ('@github-favorites:')) || [] //coloca os dados no array
    }

    save() { //salva as info, p quando atualizar a página não perder as info.
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
        
    }


    async add(username) { //para usar await a função tem q ser async
        try {

            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists) {
                throw new Error('Usuário já cadastrado!')
            }

         const user = await GithubUser.search(username) //continuação da promessa fetch
         //função assincrona, roda depois que o javascript lê linha por linha.
        
        if(user.login === undefined) {
            throw new Error('Usuário não encontrado!')
        }

        this.value = ""

        this.entries = [user, ...this.entries] //vai colocar usuário na lista e empurrando os que estavam para baixo
        this.update()
        this.save() //atualiza quando add

    } catch(error) {
        alert(error.message)
    }
}


        delete(user) {
            const filterEntries = this.entries //vai filtrar as entradas do array
            .filter(entry => entry.login !== user.login)
            
            this.entries = filterEntries //vai pegar as entradas e passar a entrada filtrada.
            this.update()
            this.save() //atualiza quando exclui
        }

}


//classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root) // o super vai chamar o constructor do Favorites para esse escopo, o #app.
        
        this.tbody = this.root.querySelector('table tbody')
        
        this.update() //chama a função nesse escopo
        this.addFavorites()
    }

    addFavorites() {
        const addButton = this.root.querySelector('.search button') //pegando o button do html
        addButton.addEventListener('click', () => {
            const { value } = this.root.querySelector('.search input') //pegando o valor dentro do input e com click vai passar o valor para o add()
            this.root.querySelector('header input').value = ''
            
            this.add(value) //valor vai ser passado para a função assincrona add()
        })
    }


    update() {
    this.removeRow() //chama função no escopo
    this.emptyTable()

    this.entries.forEach( user => { //para cada entrada vai criar uma linha
        const row = this.createRow() //row vai ser a função createRow()

        //passando as info para a linha
        row.querySelector('.user img').src = `https://github.com/${user.login}.png`
        row.querySelector('.user img').alt = `Image de ${user.name}`
        row.querySelector('.user a').href = `https://github.com/${user.login}`
        row.querySelector('.user p').textContent = user.name
        row.querySelector('.user span').textContent = user.login
        row.querySelector('.repositories').textContent = user.public_repos
        row.querySelector('.followers').textContent = user.followers

        //exclusão com o botão remove

        row.querySelector('.remove').addEventListener('click', () => {
            const ok = confirm('Tem certeza que deseja excluir essa linha?')

            if(ok){ //delete vai ser criado na função favorites
                this.delete(user)
            }
        })

        this.tbody.append(row) //append recebe um elemento da dom, html
    })
}

    emptyTable() {
        if(this.entries.length == "") {

            this.removeRow() // conforme vai adicionando e excluindo, vai criando várias linhas, precisa chamar a função para apagar.
            const emptyRow = document.createElement('tr')
            emptyRow.innerHTML = ` 
            <td colspan="4">
              <div class="no-user">
              <img src="./assets/star.svg" alt="estrela">  
                <span>       
                  Nenhum favorito ainda     
                </span>
              </div>
            </td>
          ` //colspan faz a a coluna se estender

        this.tbody.append(emptyRow)
        }
}


    createRow() { //função que vai criar lista
        const tr = document.createElement('tr') //pega a linha e passa o conteudo do html para 'content'

        tr.innerHTML = ` <td class="user"> <!-- td cria colunas no body -->
        <img src="https://github.com/devleuuon.png" alt="imagem de lennon fonseca">
        <a href="https://github.com/devleuuon" target="_blank">
        <p>Lennon Fonseca</p>
        <span>/devleuuon</span>
        </a>
        </td>

        <td class="repositories">
            76
        </td>

        <td class="followers">
            9589
        </td>

        <td>
            <button class="remove">Remove</button>
        </td>`

        return tr
    }

    removeRow() { //função que vai remover as linhas

        this.tbody.querySelectorAll('tr').forEach((tr) => { //tbody pega todas as linhas tr e para cada linha chama uma função
        tr.remove() //remove a linha do body
    })

    }

}
