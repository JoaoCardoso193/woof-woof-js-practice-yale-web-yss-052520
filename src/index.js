document.addEventListener('DOMContentLoaded', () => {

    let dogBar = document.querySelector('div#dog-bar')
    let dogInfo = document.querySelector('div#dog-info')
    let dogFilter = document.querySelector('button#good-dog-filter')

    function ce(element){
        return document.createElement(element)
    }
    
    function fetchDogs(filter = false){
        fetch('http://localhost:3000/pups')
        .then(res => res.json())
        .then(dogs => addDogs(dogs, filter))
    }

    function addDogs(dogs, filter){
        if (filter == true) {
            dogs = dogs.filter(dog => dog.isGoodDog == true)
        }
        dogs.forEach(dog => createDog(dog))
    }

    function createDog(dog) {
        let span = ce('span')
        span.innerText = dog.name
        span.addEventListener('click', () => {
            dogInfo.innerHTML = ""
            let img = document.createElement('img')
            let h2 = document.createElement('h2')
            let label = document.createElement('label')
            let button = document.createElement('button')

            img.src = dog.image
            h2.innerText = `Name: ${dog.name}`
            label.innerText = "Is Good Dog? "
            button.innerText = dog.isGoodDog

            dogInfo.append(img, h2, label, button)

            button.addEventListener('click', () => {
                let updatedDog = dog
                updatedDog.isGoodDog = !dog.isGoodDog
                
                let configObj = {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "isGoodDog": updatedDog.isGoodDog
                    })
                }
            
                fetch(`http://localhost:3000/pups/${dog.id}`, configObj)
                .then(res => res.json())
                .then(res => {
                    button.innerText = res.isGoodDog
                })
            })
        })
        dogBar.append(span)
    }

    dogFilter.addEventListener('click', () => {
        let filter = {
            "OFF": "ON",
            "ON": "OFF"
        }
        dogFilter.innerText = filter[dogFilter.innerText]
        if (dogFilter.innerText == "ON"){
            dogBar.innerHTML = ""
            fetchDogs(filter = true)
        }
        if(dogFilter.innerText == "OFF"){
            dogBar.innerHTML = ""
            fetchDogs()
        }
    })
    
    fetchDogs()

})