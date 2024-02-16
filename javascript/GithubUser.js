export class GithubUser { //entrada de dados através do api do github
    static search(username) {
        const endPoint = `https://api.github.com/users/${username}`

        //fetch é quem busca a info na internet. fetch é uma promessa.
        return fetch(endPoint).then(data => data.json()) //pega o endPoint, então pega o dado e converte o dado em json.
        .then(data => ({
            login: data.login,
            name: data.name,
            public_repos: data.public_repos,
            followers: data.followers
        }))  //({isso se chama grupo operator}) vai transformar o dado em um objeto.
    }
}