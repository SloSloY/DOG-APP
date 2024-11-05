import { Observable, Frame, alert } from '@nativescript/core';
import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-auth';

export class LoginViewModel extends Observable {
    private _email: string = '';
    private _password: string = '';
    private _errorMessage: string = '';
    private _isLoading: boolean = false;

    constructor() {
        super();
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        if (this._email !== value) {
            this._email = value;
            this.notifyPropertyChange('email', value);
        }
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        if (this._password !== value) {
            this._password = value;
            this.notifyPropertyChange('password', value);
        }
    }

    get errorMessage(): string {
        return this._errorMessage;
    }

    set errorMessage(value: string) {
        if (this._errorMessage !== value) {
            this._errorMessage = value;
            this.notifyPropertyChange('errorMessage', value);
        }
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    set isLoading(value: boolean) {
        if (this._isLoading !== value) {
            this._isLoading = value;
            this.notifyPropertyChange('isLoading', value);
        }
    }

    async onLogin() {
        try {
            this.isLoading = true;
            this.errorMessage = '';

            if (!this._email || !this._password) {
                throw new Error("Veuillez remplir tous les champs");
            }

            console.log("Tentative de connexion avec:", this._email);
            
            const auth = firebase.auth();
            const userCredential = await auth.signInWithEmailAndPassword(this._email, this._password);
            
            console.log("Connexion réussie:", userCredential.user.uid);
            
            Frame.topmost().navigate({
                moduleName: "pages/home/home-page",
                clearHistory: true
            });
        } catch (error) {
            console.error("Erreur de connexion:", error);
            await alert({
                title: "Erreur de connexion",
                message: error.message || "Vérifiez vos identifiants",
                okButtonText: "OK"
            });
            this.errorMessage = error.message || "Erreur de connexion";
        } finally {
            this.isLoading = false;
        }
    }

    async onRegister() {
        try {
            this.isLoading = true;
            this.errorMessage = '';

            if (!this._email || !this._password) {
                throw new Error("Veuillez remplir tous les champs");
            }

            if (this._password.length < 6) {
                throw new Error("Le mot de passe doit contenir au moins 6 caractères");
            }

            console.log("Tentative d'inscription avec:", this._email);
            
            const auth = firebase.auth();
            const userCredential = await auth.createUserWithEmailAndPassword(this._email, this._password);
            
            console.log("Inscription réussie:", userCredential.user.uid);
            
            Frame.topmost().navigate({
                moduleName: "pages/home/home-page",
                clearHistory: true
            });
        } catch (error) {
            console.error("Erreur d'inscription:", error);
            await alert({
                title: "Erreur d'inscription",
                message: error.message || "Essayez avec un autre email",
                okButtonText: "OK"
            });
            this.errorMessage = error.message || "Erreur d'inscription";
        } finally {
            this.isLoading = false;
        }
    }
}