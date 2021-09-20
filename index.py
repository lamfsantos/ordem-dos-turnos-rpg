import os
import sys
import platform
from tkinter import *
import tkinter as tk

lista = [('Personagem', 'Jogador', 'Raça', 'Iniciativa', 'Defesa')]
#,
#			('teste_personagem1', 'teste_jogador1', 'teste_raça1', 10, '21'),
#			('teste_personagem2', 'teste_jogador2', 'teste_raça2', 12, '43')
#lista = []

iniciativa = 0

class Table:
      
	def __init__(self,root,total_columns,total_rows,lst):
  
        # code for creating table
		for i in range(total_rows):
			for j in range(total_columns):
				fg = 'blue'

				if(i==0):
					fg = 'black'
				elif(lista[i][3] == iniciativa):
					fg = 'red'

				self.e = Entry(root, width=18, fg=fg,font=('Arial',12,'bold'))

				self.e.grid(row=i, column=j)
				self.e.insert(END, lst[i][j])


def create_view_cadastro():
	window = tk.Tk()
	window.title("RPG")
	window.geometry("345x180")
	window.configure(background="#008B8B")


	txt_personagem = tk.Label(window, text='Nome do personagem:', background='#008B8B', foreground="#000000")
	txt_jogador  = tk.Label(window, text='Nome do jogador:', background='#008B8B', foreground="#000000")
	txt_raca = tk.Label(window, text='Raça:', background='#008B8B', foreground="#000000")
	txt_iniciativa = tk.Label(window, text='Iniciativa:', background='#008B8B', foreground="#000000")
	txt_defesa = tk.Label(window, text='Defesa:', background='#008B8B', foreground="#000000")

	input_personagem= tk.Entry(window)
	input_jogador= tk.Entry(window)
	input_raca= tk.Entry(window)
	input_iniciativa= tk.Entry(window)
	input_defesa= tk.Entry(window)

	txt_personagem.grid(row=0, column=0)
	txt_jogador.grid(row=1, column=0)
	txt_raca.grid(row=2, column=0)
	txt_iniciativa.grid(row=3, column=0)
	txt_defesa.grid(row=4, column=0)

	input_personagem.grid(row=0, column=1)
	input_jogador.grid(row=1, column=1)
	input_raca.grid(row=2, column=1)
	input_iniciativa.grid(row=3, column=1)
	input_defesa.grid(row=4, column=1)

	novo_personagem = (input_personagem, input_jogador, input_raca, input_iniciativa, input_defesa)

	#AQUI
	btn = tk.Button(window, text='Confirma', command=lambda: cadastro_personagem(novo_personagem, window))
	btn.grid(row=8, column=1)

	return window

def cadastro_personagem(novo_personagem, window):
	atributos = []
	for atributo in novo_personagem:
		atributos.append(atributo.get())

	lista.append(tuple(atributos))

	window.destroy()

def refresh_view(window):
	window.destroy()
	create_view_iniciativa(lista)

def proxima_iniciativa(window):
	global iniciativa
	if(iniciativa == 0):
		iniciativa_aux = 0;
		i = 0
		for personagem in lista:
			if i==0:
				i+=1
			elif int(personagem[3]) > int(iniciativa_aux):
				iniciativa_aux = personagem[3]

		iniciativa = iniciativa_aux

	else:
		iniciativa_aux = 0;

		i = 0
		for personagem in lista:
			if i==0:
				i+=1
			elif int(personagem[3]) > int(iniciativa_aux) and int(personagem[3]) < int(iniciativa):
				iniciativa_aux = personagem[3]

		iniciativa = iniciativa_aux

	refresh_view(window)

def create_view_iniciativa(lista):
	window = tk.Tk()
	window.title("Iniciativa")
	window.geometry("830x180")
	window.configure(background="#008B8B")

	txt_title_personagens = tk.Label(text='Personagens')
	txt_title_personagens.grid(column=2)

	if len(lista) > 0:
		total_rows = len(lista)
		total_columns = len(lista[0])
		table = Table(window, total_columns, total_rows, lista)

	txt_space = tk.Label(text='', background='#008B8B')
	txt_space.grid()


	btn = tk.Button(window, text='Adicionar', command=create_view_cadastro)
	btn.grid(column=2)

	btn2 = tk.Button(window, text='Próximo', command=lambda: proxima_iniciativa(window))
	btn2.grid(column=2)

	btn3 = tk.Button(window, text='Atualizar', command=lambda: refresh_view(window))
	btn3.grid(column=2)

	return window

if __name__ == '__main__':
	window = create_view_iniciativa(lista)
	window.mainloop()