from tkinter import *
from tkinter import ttk

ws=Tk()

ws.title('RPG')
ws.geometry('850x650')
ws['bg'] = '#AC99F2'


set = ttk.Treeview(ws)
set.pack(anchor=CENTER)

set['columns']= ('Personagem', 'Jogador', 'Raca', 'Iniciativa', 'Defesa')
set.column("#0", stretch=NO, width=0)
set.column("Personagem", width=99)
set.column("Jogador", width=80)
set.column("Raca", width=80)
set.column("Iniciativa", width=80)
set.column("Defesa", width=80)

set.heading("#0",text="")
set.heading("Personagem",text="Personagem")
set.heading("Jogador",text="Jogador")
set.heading("Raca",text="raça")
set.heading("Iniciativa",text="Iniciativa")
set.heading("Defesa",text="Defesa")

data  = []

global count
count=0

for record in data:

    set.insert(parent='',index='end',iid = count,text='',values=(record[0],record[1],record[2],record[3],record[4]))

    count += 1


Input_frame = Frame(ws)
Input_frame.pack()

personagem= Label(Input_frame,text="Personagem")
personagem.grid(row=0,column=0)

iniciativa = Label(Input_frame,text="Jogador")
iniciativa.grid(row=0,column=1)

raca = Label(Input_frame,text="Raça")
raca.grid(row=0,column=2)

iniciativa = Label(Input_frame,text="Iniciativa")
iniciativa.grid(row=0,column=3)

defesa = Label(Input_frame,text="defesa")
defesa.grid(row=0,column=4)

personagem_entry = Entry(Input_frame)
personagem_entry.grid(row=1,column=0)

jogador_entry = Entry(Input_frame)
jogador_entry.grid(row=1,column=1)

raca_entry = Entry(Input_frame)
raca_entry.grid(row=1,column=2)

iniciativa_entry = Entry(Input_frame)
iniciativa_entry.grid(row=1,column=3)

defesa_entry = Entry(Input_frame)
defesa_entry.grid(row=1,column=4)

def input_record():


    global count

    set.insert(parent='',index='end',iid = count,text='',values=(personagem_entry.get(),jogador_entry.get(),raca_entry.get(), iniciativa_entry.get(), defesa_entry.get()))
    count += 1


    personagem_entry.delete(0,END)
    jogador_entry.delete(0,END)
    raca_entry.delete(0,END)
    iniciativa_entry.delete(0,END)
    defesa_entry.delete(0,END)



#button
Input_button = Button(ws,text = "Atualizar Cadastro",command= input_record)
Input_button.pack()

def __init__(self,root,total_columns,total_rows,personagem):

    # code for creating table
    for i in range(total_rows):
        for j in range(total_columns):
            fg = 'blue'

            if(i==0):
                fg = 'black'
            elif(personagem[i][3] == iniciativa):
                fg = 'red'

            self.e = Entry(root, width=18, fg=fg,font=('Arial',12,'bold'))

            self.e.grid(row=i, column=j)
            self.e.insert(END, personagem[i][j])

lst = ttk.Treeview(ws)
lst.pack(anchor=CENTER)

lst['columns']= ('Monstro', 'IniciativaM', 'DefesaM')
lst.column("#0", width=0, stretch=NO)
lst.column("Monstro", width=80)
lst.column("IniciativaM", width=80)
lst.column("DefesaM", width=80)

lst.heading("#0",text="")
lst.heading("Monstro",text="Monstro")
lst.heading("IniciativaM",text="Iniciativa")
lst.heading("DefesaM",text="Defesa")

resposta  = []

global soma
soma = 0

for record in resposta:

    lst.insert(parent='',index='end',iid = soma,text='',values=(record[0],record[1],record[2]))

    soma += 1

Input_frame = Frame(ws)
Input_frame.pack()

Monstro= Label(Input_frame,text="Monstro")
Monstro.grid(row=0,column=0)

iniciativaM = Label(Input_frame,text="iniciativa")
iniciativaM.grid(row=0,column=1)

DefesaM = Label(Input_frame,text="Defesa")
DefesaM.grid(row=0,column=2)

Monstro_entry = Entry(Input_frame)
Monstro_entry.grid(row=1,column=0)

IniciativaM_entry = Entry(Input_frame)
IniciativaM_entry.grid(row=1,column=1)

DefesaM_entry = Entry(Input_frame)
DefesaM_entry.grid(row=1,column=2)

def input_record():

    global soma

    lst.insert(parent='',index='end',iid = soma,text='',values=(Monstro_entry.get(),IniciativaM_entry.get(),DefesaM_entry.get()))
    soma += 1

    Monstro_entry.delete(0,END)
    IniciativaM_entry.delete(0,END)
    DefesaM_entry.delete(0,END)

#button
Input_button = Button(ws,text = "Atualizar Cadastro Monstros",command= input_record)
Input_button.pack()

if __name__ == '__main__':
	ws.mainloop()
