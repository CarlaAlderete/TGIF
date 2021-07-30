if(document.title == "TGIF|Home"){
    let read=document.getElementById("read")
    read.addEventListener("click", (e)=>{
        if(read.textContent == "Read more"){
        read.innerHTML="Read less"
        }else{
        read.innerHTML="Read more"
        }
    }) 
}else{
    let init={
        headers:{
            "X-API-Key": "LH4qjjgv5HkWWReftpln3AQI96dT3C6t1OnYT4A7"
        }
    }
    function callData(chamber){
        fetch("https://api.propublica.org/congress/v1/113/"+chamber+"/members.json",init)
        .then(res => res.json())
        .then(json => {
            newData=[...json.results[0].members]
            myTGIF()
        })
        .catch(err => console.error(err.message))
    }

    if (document.title == "TGIF|Senate" || document.title =="TGIF|Attendance Senate" || document.title == "TGIF|Loyalty Senate"){
        callData("senate")
    }else{
        callData("house")
    }
    function myTGIF(){
        
        if(document.title =="TGIF|Senate" || document.title =="TGIF|House"){
    
            if(document.getElementById("tbodySenate")){
                var fatherTbody = document.getElementById("tbodySenate")
                var fatherSelect = document.getElementById("selectSenate")
                
            }else{
                var fatherTbody = document.getElementById("tbodyHouse")
                var fatherSelect = document.getElementById("selectHouse")
            }
            let filteresState = "all"
            let filteresParty = ["r","d","ind"]
            let showMemberes=[]
            let newShowMemberes=[]
            let newStates=[]
        
            function readFilters(){
                if(filteresState == "all"){
                    showMemberes=newData
                }else{
                    showMemberes=newData.filter(member => member.state==filteresState)
                }
                newShowMemberes=[]
                showMemberes.forEach(member =>{
                    if(member.party == "R" && filteresParty.includes("r")){
                        newShowMemberes.push(member)
                    }else if(member.party == "D" && filteresParty.includes("d")){
                        newShowMemberes.push(member)
                    }else if(member.party == "ID" && filteresParty.includes("ind")){
                        newShowMemberes.push(member)
                    }
                })
                addElements(newShowMemberes,fatherTbody)
            }
        
            function addElements(elements,father){
                fatherTbody.innerHTML=""
                if(elements.length !==0){
                    elements.forEach(element =>{
                        let tr=document.createElement("tr")
                        let tdName=document.createElement("td")
                        tr.appendChild(tdName)
                        let a=document.createElement("a")
                        a.innerText=`${element.first_name} ${element.middle_name ||""} ${element.last_name}`
                        a.href=element.url
                        a.setAttribute("target","_bank")
                        tdName.appendChild(a)
                        let tdParty=document.createElement("td")
                        tdParty.innerText=element.party
                        tr.appendChild(tdParty)
                        let tdState=document.createElement("td")
                        tdState.innerText=element.state
                        tr.appendChild(tdState)
                        let tdYears=document.createElement("td")
                        tdYears.innerText=element.seniority
                        tr.appendChild(tdYears)
                        let tdVot=document.createElement("td")
                        tdVot.innerText=`${element.votes_with_party_pct.toFixed(2)} %`
                        tr.appendChild(tdVot)
                        father.appendChild(tr)
                    })
                }else{
                    let tr=document.createElement("tr")
                    let tdNull=document.createElement("td")
                    tdNull.innerText="No information to show"
                    tdNull.setAttribute("colspan","5")
                    tdNull.classList.add("text-center")
                    tr.appendChild(tdNull)
                    father.appendChild(tr)
                    
                }
            }

            addElements(newData,fatherTbody)
        
            newData.forEach(members=>{
                if(!newStates.includes(members["state"])){
                    newStates.push(members["state"]) 
                }
            })
            newStates=newStates.sort()
            function addSelect(element, father){
                let option=document.createElement("option")
                option.innerText=element
                option.setAttribute("value",element)
                father.appendChild(option)
            }
        
            newStates.forEach(member => addSelect(member,fatherSelect))
        
            fatherSelect.addEventListener("change", (e)=>{
                let selectOption = e.target.value
                filteresState = selectOption
                readFilters()
            })
        
            let checkboxes=document.getElementsByName("party")
            checkboxes= Array.from(checkboxes)
            checkboxes.forEach(checkbox =>{
                checkbox.addEventListener("change", (e)=>{
                    let checkParty = e.target.value
                    let checkPartyTick = e.target.checked
                    if (filteresParty.includes(checkParty) && !checkPartyTick) {
                        filteresParty = filteresParty.filter(party => party !== checkParty)
                    }else if(filteresParty.includes(checkParty) && checkPartyTick) {
                        filteresParty = filteresParty.filter(party => party == checkParty)
                    }else{
                        filteresParty.push(checkParty)
                    }
                    readFilters()
                })
            })
           }else{
            const statistics = {
                democrats:{
                    cant:0,
                    PromPctVotesParty:0,
                    PromMissedVotes:0
                },
                republicans:{
                    cant:0,
                    PromPctVotesParty:0,
                    PromMissedVotes:0
                },
                independents:{
                    cant:0,
                    PromPctVotesParty:0,
                    PromMissedVotes:0
                },
                engaged:{
                    most:[],
                    least:[]
                },
                loyal:{
                    most:[],
                    least:[]
                }
            }
            
            let democrats=newData.filter(member => member.party == "D")
            let republicans=newData.filter(member => member.party == "R")
            let independents=newData.filter(member => member.party == "ID")
            let newMemberes=newData.filter(member => member.total_votes !==0)
            statistics.democrats.cant=democrats.length
            statistics.republicans.cant=republicans.length
            statistics.independents.cant=independents.length
            statistics.democrats.PromPctVotesParty=average(democrats,"votes_with_party_pct")
            statistics.republicans.PromPctVotesParty=average(republicans,"votes_with_party_pct")
            statistics.independents.PromPctVotesParty=average(independents,"votes_with_party_pct")
            statistics.democrats.PromMissedVotes=average(democrats,"missed_votes_pct")
            statistics.republicans.PromMissedVotes=average(republicans,"missed_votes_pct")
            statistics.independents.PromMissedVotes=average(independents,"missed_votes_pct")
            statistics.engaged.most=order(newMemberes,"missed_votes_pct").slice(0,(order(newMemberes,"missed_votes_pct").length*0.1))
            statistics.engaged.least=(order(newMemberes,"missed_votes_pct").slice(order(newMemberes,"missed_votes_pct").length*0.9,order(newMemberes,"missed_votes_pct").length)).reverse()
            statistics.loyal.least=order(newMemberes,"votes_with_party_pct").slice(0,order(newMemberes,"votes_with_party_pct").length*0.1)
            statistics.loyal.most=(order(newMemberes,"votes_with_party_pct").slice(order(newMemberes,"votes_with_party_pct").length*0.9,order(newMemberes,"votes_with_party_pct").length)).reverse()
        
            function average(members,pct){
                let pctVotesParty=members.reduce((acc, members) => acc + members[pct],0)
                let promedio=pctVotesParty !== 0 ? pctVotesParty/members.length : "-"
                return promedio
            }
            
            function order(members,pct){
                let orderMembers=members.sort((a,b)=> a[pct]-b[pct])
                return orderMembers
            }
        
            function addElementsTable1(member,prom,father){
                let tdCant=document.createElement("td")
                tdCant.innerText=member.cant
                father.appendChild(tdCant)
                let tdProm=document.createElement("td")
                tdProm.innerText= member[prom] === "-" ? "-" : `${member[prom].toFixed(2)} %`
                father.appendChild(tdProm)
            }
        
            let trTotal=document.getElementById("trTotal")
            let tdTotal=document.createElement("td")
            let totalNull=document.createElement("td")
            totalNull.innerText="-"
            tdTotal.innerText=statistics.democrats.cant + statistics.republicans.cant + statistics.independents.cant
            trTotal.appendChild(tdTotal)
            trTotal.appendChild(totalNull)
        
            function addTables(members,vot,votPct,father){
                members.forEach(member=>{
                    let tr=document.createElement("tr")
                    let tdName=document.createElement("td")
                    tdName.innerText=`${member.first_name} ${member.middle_name ||""} ${member.last_name}`
                    tr.appendChild(tdName)
                    let trDMissedVot=document.createElement("td")
                    trDMissedVot.innerText= vot === "missed_votes" ? member[vot] : votWParty(member)
                    tr.appendChild(trDMissedVot)
                    let tdVot=document.createElement("td")
                    tdVot.innerText=`${member[votPct].toFixed(2)} %`
                    tr.appendChild(tdVot)
                    father.appendChild(tr)
                })
            }
        
            function votWParty(member){
                return Math.round(member.total_votes - member.missed_votes * member.votes_with_party_pct/100)
            }
        
            if(document.getElementById("trDMissed")){
                addElementsTable1(statistics.democrats,"PromMissedVotes",trDMissed)
                addElementsTable1(statistics.republicans,"PromMissedVotes",trRMissed)
                addElementsTable1(statistics.independents,"PromMissedVotes",trIMissed)
            }else{
                addElementsTable1(statistics.democrats,"PromPctVotesParty",trDWith)
                addElementsTable1(statistics.republicans,"PromPctVotesParty",trRWith)
                addElementsTable1(statistics.independents,"PromPctVotesParty",trIWith)
            }
        
            if(document.getElementById("tbodyLeastAtt")){
                addTables(statistics.engaged.most,"missed_votes","missed_votes_pct",tbodyMostAtt)
                addTables(statistics.engaged.least,"missed_votes","missed_votes_pct",tbodyLeastAtt) 
            }else{
                addTables(statistics.loyal.least,"","votes_with_party_pct",tbodyLeastLoyal)
                addTables(statistics.loyal.most,"","votes_with_party_pct",tbodyMostLoyal)
            }
           }
    }
}
