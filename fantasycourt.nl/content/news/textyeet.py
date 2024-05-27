
#namelist=["1234-56-78-BAAqA"]
#titlist=["BAqA"]
#namelist=["2024-04-26-eetkraampjes","2024-04-30-activiteiten","2024-05-05-kraampjes-1","2024-05-14-kraampjes-2","2024-05-11-kraampjes-3","2024-05-16-kraampjes-4","2024-05-18-kraampjes-5","2024-05-22-kraampjes-6","2024-05-26-kraampjes-7","2024-05-30-kraampjes-8","2024-06-03-kraampjes-9","2024-06-05-kraampjes-extra","2024-05-06-larp en goed doel"]
#titlist=["Eetkraampjes: Kürtõskalács, La Salsa Latina, iScoop Ice Cream. ","Activiteiten: zwaardvechten, boogschieten, kostuumwedstrijd.","Kraampjes: Dreamy Cauldron, Yayday, Red Dragon Jewelry, Custom Costumes, Mamorumori.","Nog meer Kraampjes: Divini Couture, Dolle Griet, Feys craftshop, Elfdehands boeken, The Wolf and Rabbit, The Lugon Project.","Heel Veel Kraampjes: Kapitein Kleerhaak, The Fantasy Bug, Narquelics Chainmail Jewelry, Empire of Minis, Wiggley's Wonder Workshop.","Kraampjes, Kraampjes, Kraampjes: Ccgwinkel, Larpcenter, Arctis Ira, EverAfterprint, OOAKdolls by Mariska.","Twee Dozijn kraampjes: Fairyland, VonkenStaal, Nooni-en-Neik  (Nooni Design), GridStuff, The Wandering Merchant (voormalig eldirsar crafts).","Ik zie ik zie wat jij niet ziet en het zijn kraampjes: Atelier spintol, Faeryfindings, Cross Elf , I Do Hobbys , The Secret Moon Shop.","Torens vol met kraampjes: Wancelot, The rogue's hoard , Pagan Ways, Labyrinth Eindhoven.","But wait, there's kraampjes: Vintage Fantasy Flair , De Huiself, Dreamchaser Art, ArrowGlass , Studio FADE.","Alle Kraampjes: Céline's Art Studio , Imkerij de Walhut , Nether & Fable, t Speldenhuis, Somnivera Events.","Extra Kraampjes: The Wisper Woods.","larp en goed doel: Toys in the Attic, LRP Ravenskeep Adventures, Books4life."]
namelist=["2024-05-05-kraampjes-1","2024-05-14-kraampjes-2","2024-05-11-kraampjes-3","2024-05-16-kraampjes-4","2024-05-18-kraampjes-5","2024-05-22-kraampjes-6","2024-05-26-kraampjes-7","2024-05-30-kraampjes-8","2024-06-03-kraampjes-9","2024-06-05-kraampjes-extra","2024-05-06-larp en goed doel"]
titlist=["Kraampjes: Dreamy Cauldron, Yayday, Red Dragon Jewelry, Custom Costumes, Mamorumori.","Nog meer Kraampjes: Divini Couture, Dolle Griet, Feys craftshop, Elfdehands boeken, The Wolf and Rabbit, The Lugon Project.","Heel Veel Kraampjes: Kapitein Kleerhaak, The Fantasy Bug, Narquelics Chainmail Jewelry, Empire of Minis, Wiggley's Wonder Workshop.","Kraampjes, Kraampjes, Kraampjes: Ccgwinkel, Larpcenter, Arctis Ira, EverAfterprint, OOAKdolls by Mariska.","Twee Dozijn kraampjes: Fairyland, VonkenStaal, Nooni-en-Neik  (Nooni Design), GridStuff, The Wandering Merchant (voormalig eldirsar crafts).","Ik zie ik zie wat jij niet ziet en het zijn kraampjes: Atelier spintol, Faeryfindings, Cross Elf , I Do Hobbys , The Secret Moon Shop.","Torens vol met kraampjes: Wancelot, The rogue's hoard , Pagan Ways, Labyrinth Eindhoven.","But wait, there's kraampjes: Vintage Fantasy Flair , De Huiself, Dreamchaser Art, ArrowGlass , Studio FADE.","Alle Kraampjes: Céline's Art Studio , Imkerij de Walhut , Nether & Fable, t Speldenhuis, Somnivera Events.","Extra Kraampjes: The Wisper Woods.","larp en goed doel: Toys in the Attic, LRP Ravenskeep Adventures, Books4life."]



for i,_ in enumerate(namelist):
    with open(namelist[i]+".nl.md", "w", encoding="utf-8") as f:
        f.write("--- \n")
        f.write("type: news \n")
        f.write(f'title: "{titlist[i]}" \n')
        f.write(f"publishDate: {namelist[i][:10]}T17:00:00+02:00 \n")
        f.write("--- \n")
        f.write("\n")

    with open(namelist[i]+".en.md", "w", encoding="utf-8") as f:
        f.write("--- \n")
        f.write("type: news \n")
        f.write(f'title: "{titlist[i]}" \n')
        f.write(f"publishDate: {namelist[i][:10]}T17:00:00+02:00 \n")
        f.write("--- \n")
        f.write("\n")
        
print("Yotten")