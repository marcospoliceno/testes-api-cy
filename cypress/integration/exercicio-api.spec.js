/// <reference types="cypress" />
import contrato from '../contracts/usuario.contract'

describe('Testes da Funcionalidade Usuários', () => {

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               expect(response.duration).to.be.lessThan(20)
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": `Usuario teste ${Math.floor(Math.random() * 100000000)}`,
                    "email": `testecadastrouser${Math.floor(Math.random() * 100000000)}@qa.com.br`,
                    "password": "teste",
                    "administrador": "true"
               },
          }).then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
          })
     });

     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuario('User test', 'test@qa.com.br', 'test', 'true')
          cy.request({
               method: 'POST',
               url: 'usuarios',
               failOnStatusCode: false,
               body: {
                    "nome": 'User test',
                    "email": 'test@qa.com.br',
                    "password": "test",
                    "administrador": "true"
               },
          }).then((response) => {
               expect(response.status).to.equal(400)
               expect(response.body.message).to.equal('Este email já está sendo usado')
          })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          cy.cadastrarUsuario('Usuario teste edit', `testecadastrousers${Math.floor(Math.random() * 100000000)}@qa.com.br`, 'test', 'true').then(response => {
               let id = response.body._id
               cy.request({
                    method: 'PUT',
                    url: `usuarios/${id}`,
                    failOnStatusCode: false,
                    body: {
                         "nome": 'User test alterado',
                         "email": `testecadastrousers${Math.floor(Math.random() * 100000000)}@qa.com.br`,
                         "password": "test",
                         "administrador": "true"
                    },
               }).then((response) => {
                    expect(response.status).to.equal(200)
                    expect(response.body.message).to.equal('Registro alterado com sucesso')
               })
          });
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          cy.cadastrarUsuario(`Usuario teste ${Math.floor(Math.random() * 100000000)}`, `testecadastrousers${Math.floor(Math.random() * 100000000)}@qa.com.br`, 'test', 'true').then(response => {
               let id = response.body._id
               cy.request({
                    method: 'DELETE',
                    url: `usuarios/${id}`,
               }).then(response => {
                    expect(response.body.message).to.equal('Registro excluído com sucesso')
                    expect(response.status).to.equal(200)
               })
          });
     });
});
