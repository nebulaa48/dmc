//GENERATED TABLE MODEL FOR TABLE users FROM DATABASE dmc

class Users {
  id: number;
  nom: string;
  prenom: string;
  pseudo: string;
  telephone: string | null;

  constructor(id: number, nom: string, prenom: string, pseudo: string, telephone: string | null) {
		this.id = id;
		this.nom = nom;
		this.prenom = prenom;
		this.pseudo = pseudo;
		this.telephone = telephone;
  }
}
                