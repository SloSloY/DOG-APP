import { Observable } from '@nativescript/core';
import { Geolocation } from '@nativescript/geolocation';
import { Camera } from '@nativescript/camera';
import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-firestore';
import '@nativescript/firebase-storage';

export class HomeViewModel extends Observable {
    selectedTab: number = 0;
    searchRadius: number = 10;
    notificationsEnabled: boolean = true;
    darkMode: boolean = false;
    
    currentDog: any = {
        name: "Max",
        age: 3,
        image: "https://images.dog.ceo/breeds/husky/n02110185_10047.jpg",
        location: "Paris, France",
        description: "Max est un husky très joueur qui adore les longues promenades."
    };

    conversations: Array<any> = [
        {
            profileImage: "https://randomuser.me/api/portraits/women/1.jpg",
            name: "Sophie Martin",
            lastMessage: "Votre chien est adorable !",
            time: "10:30"
        },
        {
            profileImage: "https://randomuser.me/api/portraits/men/2.jpg",
            name: "Thomas Bernard",
            lastMessage: "On se voit au parc demain ?",
            time: "Hier"
        }
    ];

    userProfile: any = {
        image: "https://randomuser.me/api/portraits/men/85.jpg",
        name: "Jean Dupont",
        bio: "Amoureux des chiens 🐕 | Éducateur canin",
        posts: 15,
        followers: 234,
        following: 186
    };

    newDogImage: string = '';
    dogName: string = '';
    dogAge: string = '';
    dogBreed: string = '';
    location: string = '';
    description: string = '';

    constructor() {
        super();
        this.requestLocationPermission();
        this.loadDogs();
    }

    async requestLocationPermission() {
        const hasPermission = await Geolocation.requestPermissions();
        if (hasPermission) {
            this.getCurrentLocation();
        }
    }

    async getCurrentLocation() {
        try {
            const location = await Geolocation.getCurrentLocation({
                desiredAccuracy: 3,
                maximumAge: 5000,
                timeout: 10000
            });
            this.loadDogsNearby(location.latitude, location.longitude);
        } catch (error) {
            console.error('Error getting location', error);
        }
    }

    async loadDogsNearby(latitude: number, longitude: number) {
        try {
            const dogsCollection = firebase.firestore().collection('dogs');
            // Implémenter la logique de géolocalisation
        } catch (error) {
            console.error('Error loading dogs:', error);
        }
    }

    async onTakePhoto() {
        try {
            const image = await Camera.takePicture({
                width: 1024,
                height: 1024,
                keepAspectRatio: true,
                saveToGallery: false
            });
            this.newDogImage = image.android || image.ios;
            this.notifyPropertyChange('newDogImage', this.newDogImage);
        } catch (error) {
            console.error('Error taking photo', error);
        }
    }

    async onPost() {
        try {
            if (!this.dogName || !this.location || !this.description) {
                throw new Error("Veuillez remplir tous les champs obligatoires");
            }

            const imagePath = `dogs/${Date.now()}.jpg`;
            const reference = firebase.storage().ref(imagePath);
            await reference.putFile(this.newDogImage);
            const imageUrl = await reference.getDownloadURL();

            await firebase.firestore().collection('dogs').add({
                name: this.dogName,
                age: parseInt(this.dogAge) || 0,
                breed: this.dogBreed,
                imageUrl,
                location: this.location,
                description: this.description,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                userId: firebase.auth().currentUser?.uid
            });

            // Reset form
            this.newDogImage = '';
            this.dogName = '';
            this.dogAge = '';
            this.dogBreed = '';
            this.location = '';
            this.description = '';
            this.notifyPropertyChange('newDogImage', '');
            this.notifyPropertyChange('dogName', '');
            this.notifyPropertyChange('dogAge', '');
            this.notifyPropertyChange('dogBreed', '');
            this.notifyPropertyChange('location', '');
            this.notifyPropertyChange('description', '');
        } catch (error) {
            console.error('Error posting dog', error);
        }
    }

    onLike() {
        console.log('Like');
        this.loadNextDog();
    }

    onReject() {
        console.log('Reject');
        this.loadNextDog();
    }

    onMessage() {
        console.log('Message');
    }

    onNotifications() {
        console.log('Notifications');
    }

    onEditProfile() {
        console.log('Edit Profile');
    }

    loadNextDog() {
        // Simuler le chargement du prochain chien
        const dogs = [
            {
                name: "Luna",
                age: 2,
                image: "https://images.dog.ceo/breeds/retriever-golden/n02099601_1068.jpg",
                location: "Lyon, France",
                description: "Luna est une golden retriever très douce et affectueuse."
            },
            {
                name: "Rocky",
                age: 4,
                image: "https://images.dog.ceo/breeds/germanshepherd/n02106662_26894.jpg",
                location: "Marseille, France",
                description: "Rocky est un berger allemand intelligent et protecteur."
            }
        ];
        
        this.currentDog = dogs[Math.floor(Math.random() * dogs.length)];
        this.notifyPropertyChange('currentDog', this.currentDog);
    }

    async loadDogs() {
        try {
            // Implémenter le chargement des chiens depuis Firestore
        } catch (error) {
            console.error('Error loading dogs:', error);
        }
    }

    async onLogout() {
        try {
            await firebase.auth().signOut();
            const frame = require('@nativescript/core').Frame;
            frame.topmost().navigate({
                moduleName: 'pages/login/login-page',
                clearHistory: true
            });
        } catch (error) {
            console.error('Error logging out', error);
        }
    }
}