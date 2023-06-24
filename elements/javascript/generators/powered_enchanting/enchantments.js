var translation_array = [{
		lang: "German",
		mis_level_comb: '[{"text":"Du musst Level ","color":"dark_red"},{"score":{"name":"@e[tag=powerench_combine_detect,limit=1,sort=nearest]","objective":"powerench"},"color":"dark_red"},{"text":" sein","color":"dark_red"}]',
		mis_level_comb_txt: "Du musst Level 10 sein",
		table_dis: "Verzauberungstische benötigen 20 Blöcke Abstand zu einander.",
		full_charge: "Der Verzauberungstisch ist voll aufgeladen",
		lapis_slice: "Lapislazuli Stück",
		book_back: "Lege das Buch auf den Tisch zurück",
		mis_level_ench: '[{"text":"Du musst Level ","color":"dark_red"},{"score":{"name":"@s","objective":"powerench_slot"},"color":"dark_red"},{"text":" sein","color":"dark_red"}]',
		mis_level_ench_txt: "Du musst Level 10 sein"
	},{
		lang: "Korean",
		mis_level_comb:'[{"text":"레벨이 부족합니다 ","color":"dark_red"},{"score":{"name":"@e[tag=powerench_combine_detect,limit=1,sort=nearest]","objective":"powerench"},"color":"dark_red"}]',
		mis_level_comb_txt: "레벨이 부족합니다 10",
		table_dis:"마법 부여대는 20블록의 간격을 두고 설치해야 합니다.",
		full_charge:"마법 부여대는 완전히 충전되었습니다",
		lapis_slice:"청금석 뭉치",
		book_back:"책을 탁자 위에 다시 내려놓으십시오",
		mis_level_ench:'[{"text":"레벨 ","color":"dark_red"},{"score":{"name":"@s","objective":"powerench_slot"},"color":"dark_red"},{"text":"이 되어야 합니다","color":"dark_red"}]',
		mis_level_ench_txt:"레벨 10이 되어야 합니다"
	},{
		lang: "Portuguese",
		mis_level_comb:'[{"text":"Você precisa ter nível ","color":"dark_red"},{"score":{"name":"@e[tag=powerench_combine_detect,limit=1,sort=nearest]","objective":"powerench"},"color":"dark_red"}]',
		mis_level_comb_txt: "Você precisa ter nível 10",
		table_dis:"A mesa de encantamento precisa de 20 blocos de espaço.",
		full_charge:"A mesa de encantamento está totalmente carregada",
		lapis_slice:"Fatia de lápis-lazúli",
		book_back:"Solte o livro de volta na mesa",
		mis_level_ench:'[{"text":"Você precisa ter nível ","color":"dark_red"},{"score":{"name":"@s","objective":"powerench_slot"},"color":"dark_red"}]',
		mis_level_ench_txt:"Você precisa ter nível 10"
	},{
		lang: "Spanish",
		mis_level_comb:'[{"text":"Necesitas nivel ","color":"dark_red"},{"score":{"name":"@e[tag=powerench_combine_detect,limit=1,sort=nearest]","objective":"powerench"},"color":"dark_red"}]',
		mis_level_comb_txt: "Necesitas nivel 10",
		table_dis:"La mesa de encamamientos necesita 20 bloques de espacio para poner otra.",
		full_charge:"¡La mesa de encantamientos esta totalmente cargada!",
		lapis_slice:"Lapis Lazuli Slice",
		book_back:"Deja el libro en la mesa de encantamientos",
		mis_level_ench:'[{"text":"Necesitas nivel ","color":"dark_red"},{"score":{"name":"@s","objective":"powerench_slot"},"color":"dark_red"}]',
		mis_level_ench_txt:"Necesitas nivel 10"
	},{
		lang: "Ukrainian",
		mis_level_comb: '[{"text":"Ви повинні мати ","color":"dark_red"},{"score":{"name":"@e[tag=powerench_combine_detect,limit=1,sort=nearest]","objective":"powerench"},"color":"dark_red"},{"text":"-й рівень","color":"dark_red"}]',
		mis_level_comb_txt: "Ви повинні мати 10-й рівень",
		table_dis:"Столи для зачарування потребують 20 блоків простору один від одного.",
		full_charge:"Стіл зачарування повністю заряджений",
		lapis_slice:"Шматочок лазуриту",
		book_back:"Киньте книгу назад на стіл",
		mis_level_ench:'[{"text":"Ви повинні мати ","color":"dark_red"},{"score":{"name":"@s","objective":"powerench_slot"},"color":"dark_red"},{"text":"-й рівень","color":"dark_red"}]',
		mis_level_ench_txt:"Ви повинні мати 10-й рівень"
}]



const article_array = [
    {id:"0", version_id:[138,133,128], title:["3x3 Mining", "3x3 Abbau", "거대한 손길", "Mineração 3x3", "Minería 3x3", "Майнінг 3x3"], description:"Mines a three by three area", max_lvl:1, chance:2, comp_items:[6,8], ench:["big_mining", "vein_miner"], style:"e_golem", tick:"execute as @a[predicate=powerench:big_mining/detect] at @s at @e[type=item,distance=..7,nbt={Age:0s}] run function powerench:enchantments/big_mining/detect"},
    {id:"1", version_id:[128], title:["Aqua Affinity", "Wasseraffinität", "친수성", "Afinidade aquática", "Afinidad acuática", "Рідністьводи"], description:"Increases underwater mining speed", max_lvl:1, chance:2, comp_items:[1], ench:["aqua_affinity"], style:"vanilla e_vanilla e_golem"},
    {id:"2", version_id:[138,128], title:["Auto Smelt", "Schmelzer", "뜨거운 손길", "Derretimento Automático", "Fundición", "Авто Плавка"], description:"Smelts blocks you mine", max_lvl:1, chance:2, comp_items:[6,8], ench:["auto_smelt", "silk_touch"], style:"e_golem advanced_ench", tick:"execute as @a[predicate=powerench:auto_smelt] at @s run function powerench:enchantments/auto_smelt"},
    {id:"3", version_id:[128], title:["Bane of Arthropods", "Nemesis der Gliederfüßer", "살충", "Maldição de artrópodes", "Perdición de los artrópodos", "Загибельчленистоногих"], description:"Increases damage to arthropod mobs", max_lvl:5, chance:5, comp_items:[5,7], ench:["bane_of_arthropods", "sharpness", "smite"], style:"vanilla e_vanilla e_golem"},
    {id:"4", version_id:[128], title:["Blast Protection", "Explosionsschutz", "폭발로부터 보호", "Proteção contra explosões", "Protección contra explosiones", "Захиствідвибухів"], description:"Reduces explosion damage and knockback", max_lvl:4, chance:2, comp_items:[1,2,3,4], ench:["blast_protection", "fire_protection", "projectile_protection", "protection"], style:"vanilla e_vanilla e_golem"},
    {id:"5", version_id:[128], title:["Channeling", "Entladung", "집전", "Condutividade", "Conductividad", "Блискавиця"], description:"Channels target with a lightning during thunderstorms", max_lvl:1, chance:1, comp_items:[18], ench:["channeling", "riptide"], style:"vanilla e_vanilla e_golem"},
    {id:"6", version_id:[128], title:["Depth Strider", "Wasserläufer", "물갈퀴", "Barbatanas", "Agilidad acuática", "Глибиннийбігун"], description:"Increases underwater movement speed", max_lvl:3, chance:5, comp_items:[4], ench:["depth_strider", "frost_walker"], style:"vanilla e_vanilla e_golem"},
    {id:"7", version_id:[128], title:["Efficiency", "Effizienz", "효율", "Eficiência", "Eficiencia", "Ефективність"], description:"Increases mining speed", max_lvl:5, chance:0, comp_items:[6,7,8,9,16], ench:["efficiency"], style:"vanilla e_vanilla e_golem"},
    {id:"8", version_id:[128], title:["Feather Falling", "Federfall", "가벼운 착지", "Queda suave", "Caída de pluma", "Невагомість"], description:"Reduces fall damage", max_lvl:4, chance:5, comp_items:[4], ench:["feather_falling", "soft_falling"], style:"vanilla e_vanilla e_golem"},
    {id:"9", version_id:[128], title:["Fire Aspect", "Verbrennung", "발화", "Golpe flamejante", "Aspecto ígneo", "Силавогню"], description:"Sets target on fire", max_lvl:2, chance:2, comp_items:[5], ench:["fire_aspect", "perish", "venomous"], style:"vanilla e_vanilla e_golem"},
    {id:"a", version_id:[128], title:["Fire Protection", "Feuerschutz", "화염으로부터 보호", "Proteção contra o fogo", "Protección contra el fuego", "Вогнестійкість"], description:"Reduces fire damage and burn time", max_lvl:4, chance:5, comp_items:[1,2,3,4], ench:["fire_protection", "blast_protection", "projectile_protection", "protection"], style:"vanilla e_vanilla e_golem"},
    {id:"b", version_id:[128], title:["Flame", "Flamme", "화염", "Chama", "Fuego", "Полумя"], description:"Arrow sets target on fire", max_lvl:1, chance:2, comp_items:[10], ench:["flame"], style:"vanilla e_vanilla e_golem"},
    {id:"c", version_id:[128], title:["Fortune", "Glück", "행운", "Fortuna", "Fortuna", "Удача"], description:"Increases certain block drops", max_lvl:3, chance:2, comp_items:[6,7,8,9], ench:["fortune", "silk_touch"], style:"vanilla e_vanilla e_golem"},
    {id:"d", version_id:[128], title:["Freeze", "Frost", "빙결", "Congelar", "Congelar", "Заморозка"], description:"Slows target", max_lvl:3, chance:2, comp_items:[5], ench:["freeze", "knockback"], style:"options"},
    {id:"e", version_id:[128], title:["Frost Walker", "Eisläufer", "차가운 걸음", "Passos de gelo", "Paso helado", "Льодохід"], description:"Turns Water beneath the player into Frosted Ice", max_lvl:2, chance:1, comp_items:[4], ench:["frost_walker", "depth_strider"], style:"vanilla e_golem"},
    {id:"Z", version_id:[128], title:["Health Upgrade", "Lebensverbesserung", "생명력 강화", "Upgrade de saúde", "Mejora de Vida", "Оновлення здоров'я"], description:"Get more health points", max_lvl:5, chance:5, comp_items:[2], ench:["health_upgrade"], style:"advanced_ench", tick:"execute as @a[tag=!health_upgrade,predicate=powerench:health_upgrade] run function powerench:enchantments/health_upgrade/give\nexecute as @a[tag=health_upgrade,predicate=!powerench:health_upgrade] run function powerench:enchantments/health_upgrade/clear"},
    {id:"f", version_id:[128], title:["Hot Touch", "Heiße Berührung", "따뜻한 선물", "Toque quente", "Cosecha caliente", "Гарячий дотик"], description:"Cooks harvested Potatoes", max_lvl:1, chance:2, comp_items:[9], ench:["hot_touch"], style:"", tick:"execute as @a[predicate=powerench:hot_touch] at @s run function powerench:enchantments/hot_touch"},
    {id:"g", version_id:[128], title:["Impaling", "Harpune", "찌르기", "Empalamento", "Empalamiento", "Протикання"], description:"Deals additional damage to ocean mobs", max_lvl:5, chance:2, comp_items:[18], ench:["impaling"], style:"vanilla e_vanilla e_golem"},
    {id:"h", version_id:[128], title:["Infinity", "Unendlichkeit", "무한", "Infinidade", "Infinidad", "Нескінченність"], description:"Shooting consumes no regular arrows", max_lvl:1, chance:1, comp_items:[10], ench:["infinity", "mending", "life_steal"], style:"vanilla e_vanilla e_golem"},
    {id:"i", version_id:[128], title:["Knockback", "Rückstoß", "밀치기", "Repulsão", "Empuje", "Відкидання"], description:"Increases knockback to target", max_lvl:2, chance:5, comp_items:[5], ench:["knockback", "freeze"], style:"vanilla e_vanilla e_golem"},
    {id:"j", version_id:[138,128], title:["Leaping", "Springer", "도약", "Pulando", "Salto", "Стрибун"], description:"Increases jump strenght", max_lvl:3, chance:5, comp_items:[4], ench:["leaping"], style:"e_golem", tick:"execute as @a[predicate=powerench:leaping/give] run function powerench:enchantments/leaping/give\nexecute as @a[tag=powerench_leaping,predicate=powerench:leaping/clear] run function powerench:enchantments/leaping/clear"},
    {id:"k", version_id:[128], title:["Life Steal", "Lebensklauer", "생명력 강탈", "Roubo de vida", "Robador de vida", "Вампіризм"], description:"Chance to get absorption hearts of critical hits", max_lvl:1, chance:0, comp_items:[5], ench:["life_steal", "infinity", "mending"], style:"advanced_ench"},
    {id:"l", version_id:[128], title:["Looting", "Plünderung", "약탈", "Pilhagem", "Botín", "Продуктивність"], description:"Increases mob loot", max_lvl:3, chance:2, comp_items:[5], ench:["looting"], style:"vanilla e_vanilla e_golem"},
    {id:"m", version_id:[128], title:["Loyalty", "Treue", "충절", "Lealdade", "Lealtad", "Вірність"], description:"Trident returns after being thrown", max_lvl:3, chance:5, comp_items:[18], ench:["loyalty", "riptide"], style:"vanilla e_vanilla e_golem"},
    {id:"n", version_id:[128], title:["Luck of the Sea", "Glück des Meeres", "바다의 행운", "Sorte de pescador", "Suerte marina", "Морськафортуна"], description:"Increases rate of good fishing loot", max_lvl:3, chance:2, comp_items:[14], ench:["luck_of_the_sea"], style:"vanilla e_vanilla e_golem"},
    {id:"o", version_id:[128], title:["Lure", "Köder", "미끼", "Isco", "Atracción", "Приманка"], description:"Increases fishing speed", max_lvl:3, chance:2, comp_items:[14], ench:["lure"], style:"vanilla e_vanilla e_golem"},
    {id:"p", version_id:[128], title:["Magma Walker", "Magmaläufer", "뜨거운 걸음", "Passos lavagantes", "Caminador de magma", "Лавохід"], description:"Turns Lava beneath the player into Cobblestone", max_lvl:1, chance:1, comp_items:[4], ench:["magma_walker"], style:"e_golem advanced_ench", tick:"execute as @e[tag=powerench_magma_walker,scores={powerench=..0}] at @s run function powerench:enchantments/magma_walker/reset\nexecute as @e[tag=powerench_magma_walker] run scoreboard players remove @s powerench 1\nexecute as @a[predicate=powerench:magma_walker] at @s run function powerench:enchantments/magma_walker/detect"},
    {id:"q", version_id:[128], title:["Magnetic", "Magnetisch", "자석", "Magnético", "Magnetismo", "Магнетизм"], description:"Attracts all items in the vicinity", max_lvl:2, chance:1, comp_items:[6,7,8,9,16], ench:["magnetic"], style:"e_golem", tick:"execute as @a[predicate=powerench:magnetic] at @s run function powerench:enchantments/magnetic"},
    {id:"r", version_id:[128], title:["Mending", "Reparatur", "수선", "Remendo", "Reparación", "Ремонт"], description:"Repairs item with experience", max_lvl:1, chance:0, comp_items:[0], ench:["mending", "infinity", "life_steal"], style:"vanilla e_golem advanced_ench"},
    {id:"s", version_id:[128], title:["Multishot", "Mehrfachschuss", "다중 발사", "Rajada", "Multidisparo", "Мультипостріл"], description:"Shoots 3 arrows at the cost of one", max_lvl:1, chance:2, comp_items:[12], ench:["multishot", "piercing"], style:"vanilla e_vanilla e_golem"},
    {id:"t", version_id:[128], title:["Nutrition", "Ernährer", "포만감", "Nutrição", "Nutrición", "Авто Харчування"], description:"Feeds you automatically", max_lvl:1, chance:5, comp_items:[2], ench:["nutrition"], style:"e_golem advanced_ench", tick:"execute as @a[predicate=powerench:nutrition] run effect give @s saturation 1 1 true"},
    {id:"u", version_id:[128], title:["Perish", "Verdörrung", "사멸", "Perecer", "Perecer", "Візер"], description:"Gives target the wither effect", max_lvl:3, chance:2, comp_items:[5], ench:["perish", "fire_aspect", "venomous"], style:"options"},
    {id:"v", version_id:[128], title:["Piercing", "Durchschuss", "관통", "Trespasse", "Perforación", "Пронизування"], description:"Arrows passes through multiple enemies", max_lvl:4, chance:0, comp_items:[12], ench:["piercing", "multishot"], style:"vanilla e_vanilla e_golem"},
    {id:"w", version_id:[128], title:["Power", "Stärke", "힘", "Potência", "Poder", "Сила"], description:"Increases arrow damage", max_lvl:5, chance:0, comp_items:[10], ench:["power"], style:"vanilla e_vanilla e_golem"},
    {id:"x", version_id:[128], title:["Projectile Protection", "Schusssicher", "발사체로부터 보호", "Proteção contra projéteis", "Protección contra proyectiles", "Захиствідснарядів"], description:"Reduces projectile damage", max_lvl:4, chance:5, comp_items:[1,2,3,4], ench:["projectile_protection", "blast_protection", "fire_protection", "protection"], style:"vanilla e_vanilla e_golem"},
    {id:"y", version_id:[128], title:["Protection", "Schutz", "보호", "Proteção", "Protección", "Захист"], description:"Reduces damage", max_lvl:4, chance:0, comp_items:[1,2,3,4], ench:["protection", "blast_protection", "fire_protection", "projectile_protection"], style:"vanilla e_vanilla e_golem"},
    {id:"z", version_id:[128], title:["Protection V", "Schutz V", "보호 V", "Proteção V", "Protección V", "Захист V"], description:"Increases level of Protection enchantments", max_lvl:5, chance:0, comp_items:[1,2,3,4], ench:["protection"], style:"e_golem nooptions no_files", load:"scoreboard players set #blast_protection powerench 5\nscoreboard players set #fire_protection powerench 5\nscoreboard players set #projectile_protection powerench 5\nscoreboard players set #protection powerench 5"},
    {id:"A", version_id:[128], title:["Punch", "Schlag", "밀어내기", "Impacto", "Retroceso", "Удар"], description:"Increases arrow knockback", max_lvl:2, chance:2, comp_items:[10], ench:["punch"], style:"vanilla e_vanilla e_golem"},
    {id:"B", version_id:[128], title:["Quick Charge", "Schnellladen", "빠른 장전", "Recarga rápida", "Carga rápida", "Швидкезаряджання"], description:"Decreases charging time", max_lvl:3, chance:5, comp_items:[12], ench:["quick_charge"], style:"vanilla e_vanilla e_golem"},
    {id:"X", version_id:[128], title:["Quick Hit", "Schneller Schlag", "빠른 공격", "Golpe Rápido", "Golpe rápido", "Швидкий удар"], description:"Hit faster", max_lvl:3, chance:2, comp_items:[5,7], ench:["quick_hit", "sweeping"], style:"e_golem", tick:"execute as @a[tag=!quick_hit,predicate=powerench:quick_hit] run function powerench:enchantments/quick_hit/give\nexecute as @a[tag=quick_hit,predicate=!powerench:quick_hit] run function powerench:enchantments/quick_hit/clear"},
    {id:"C", version_id:[128], title:["Reaping", "Ernter", "농부의 손길", "Colhendo", "Cosechador", "Авто Фермер"], description:"Replants seeds automatically", max_lvl:1, chance:5, comp_items:[9], ench:["reaping"], style:"e_golem", tick:"execute as @a[predicate=powerench:reaping] at @s run function powerench:enchantments/reaping"},
    {id:"D", version_id:[128], title:["Respiration", "Atmung", "호흡", "Respiração", "Respiración", "Дихання"], description:"Extends underwater breathing time", max_lvl:3, chance:2, comp_items:[1], ench:["respiration"], style:"vanilla e_vanilla e_golem"},
    {id:"E", version_id:[128], title:["Riptide", "Sog", "급류", "Corrente marinha", "Propulsión acuática", "Тягун"], description:"Hurls the player when wet", max_lvl:3, chance:2, comp_items:[18], ench:["riptide", "channeling", "loyalty"], style:"vanilla e_vanilla e_golem"},
    {id:"F", version_id:[128], title:["Sharpness", "Schärfe", "날카로움", "Afiação", "Filo", "Гострота"], description:"Increases damage", max_lvl:5, chance:0, comp_items:[5,7], ench:["sharpness", "bane_of_arthropods", "smite"], style:"vanilla e_vanilla e_golem"},
    {id:"G", version_id:[128], title:["Silk Touch", "Behutsamkeit", "섬세한 손길", "Toque de seda", "Toque de seda", "Шовковийдотик"], description:"Mined blocks drop themself", max_lvl:1, chance:1, comp_items:[6,7,8,9,16], ench:["silk_touch", "auto_smelt", "fortune"], style:"vanilla e_vanilla e_golem"},
    {id:"H", version_id:[128], title:["Smite", "Bann", "강타", "Impacto divino", "Golpeo", "Небеснакара"], description:"Increases damage to undead mobs", max_lvl:5, chance:5, comp_items:[5,7], ench:["smite", "bane_of_arthropods", "sharpness"], style:"vanilla e_vanilla e_golem"},
    {id:"Y", version_id:[138,128], title:["Sneak Healer", "Schleichheilung", "재생의 잠행", "Curandeiro furtivo", "Sanador furtivo", "Підступний цілитель"], description:"Heal yourself while sneaking", max_lvl:2, chance:2, comp_items:[3], ench:["sneak_healer", "swift_sneak"], style:"advanced_ench", tick:"execute as @a[tag=!sneak_healer,predicate=powerench:sneak_healer] run function powerench:enchantments/sneak_healer/give\nexecute as @a[tag=sneak_healer,predicate=!powerench:sneak_healer] run function powerench:enchantments/sneak_healer/clear"},
    {id:"I", version_id:[128], title:["Soft Falling", "Weicher Fall", "부드러운 착지", "Queda suave", "Caída suave", "М'яке падіння"], description:"No fall damage", max_lvl:1, chance:5, comp_items:[4], ench:["soft_falling", "feather_falling"], style:"e_golem advanced_ench", tick:"execute as @a[predicate=powerench:soft_falling] run function powerench:enchantments/soft_falling"},
    {id:"J", version_id:[128], title:["Soul Speed", "Seelenläufer", "영혼 가속", "Velocidade das almas", "Velocidad del alma", "Швидкістьдуш"], description:"Increases walking speed on Soul Blocks", max_lvl:3, chance:1, comp_items:[4], ench:["soul_speed", "swiftness"], style:"vanilla e_golem"},
    {id:"K", version_id:[128], title:["Soulbound", "Seelenbindung", "영혼결속", "Alma perdida", "Vínculo del alma", "Прив'язка душі"], description:"Get item back after death<br><small>(Currently not by death in void)</small>", max_lvl:1, chance:0, comp_items:[0], ench:["soulbound"], style:"e_golem advanced_ench", tick:"execute as @a[tag=!powerench_soulbound,predicate=powerench:soulbound] at @s run function powerench:enchantments/soulbound/detect\nexecute at @a[tag=powerench_soulbound] as @e[tag=powerench_soulbound_item] run function powerench:enchantments/soulbound/tp\nexecute as @a[tag=powerench_soulbound,predicate=!powerench:soulbound] run function powerench:enchantments/soulbound/reset"},
    {id:"L", version_id:[128], title:["Sweeping Edge", "Schwungkraft", "휩쓸기", "Alcance", "Barrido", "Нищівнелезо"], description:"Increases sweep attack damage", max_lvl:3, chance:2, comp_items:[5], ench:["sweeping", "quick_hit"], style:"vanilla e_vanilla e_golem"},
    {id:"V", version_id:[133], title:["Swift Sneak", "Huschen", "신속한 잠행", "Agacho ágil", "Sigilo veloz", "Бігкрадькома"], description:"Increases sneaking speed", max_lvl:3, chance:0, comp_items:[3], ench:["swift_sneak", "sneak_healer"], style:"vanilla e_golem advanced_ench"},
    {id:"W", version_id:[133], title:["Swift Sneak V", "Huschen V", "신속한 잠행 V", "Agacho ágil V", "Sigilo veloz V", "Бігкрадькома V"], description:"Increases level of Swift Sneak enchantment", max_lvl:5, chance:0, comp_items:[3], ench:["swift_sneak"], style:"nooptions no_files", load:"scoreboard players set #swift_sneak powerench 5"},
    {id:"M", version_id:[138,128], title:["Swiftness", "Geschwindigkeit", "신속", "Velocidades", "Rapidez", "Сонік"], description:"Increases walking speed", max_lvl:3, chance:2, comp_items:[4], ench:["swiftness", "soul_speed"], style:"e_golem", tick:"execute as @a[predicate=powerench:swiftness/give] run function powerench:enchantments/swiftness/give\nexecute as @a[tag=powerench_swiftness,predicate=powerench:swiftness/clear] run function powerench:enchantments/swiftness/clear"},
    {id:"N", version_id:[128], title:["Thorns", "Dornen", "가시", "Espinhos", "Espinas", "Шипи"], description:"Reflects some of the damage taken to enemie", max_lvl:3, chance:1, comp_items:[1,2,3,4], ench:["thorns"], style:"vanilla e_vanilla e_golem"},
    {id:"O", version_id:[128], title:["Timber", "Abholzung", "목수의 손길", "Madeira", "Talador", "Дроворуб"], description:"Breaks connected Logs", max_lvl:3, chance:1, comp_items:[7], ench:["timber"], style:" e_golem", tick:"execute as @a[predicate=powerench:timber] at @s at @e[type=item,distance=..7,nbt={Age:0s}] run function powerench:enchantments/timber/execute"},
    {id:"P", version_id:[128], title:["Unbreaking", "Haltbarkeit", "내구성", "Inquebrável", "Irrompibilidad", "Незламність"], description:"Increases item durability", max_lvl:3, chance:5, comp_items:[0], ench:["unbreaking"], style:"vanilla e_vanilla e_golem"},
    {id:"Q", version_id:[128], title:["Unbreaking V", "Haltbarkeit V", "내구성 V", "Inquebrável V", "Irrompibilidad V", "Незламність V"], description:"Increases level of Unbreaking enchantment", max_lvl:5, chance:5, comp_items:[0], ench:["unbreaking"], style:"e_golem nooptions no_files", load:"scoreboard players set #unbreaking powerench 5"},
    {id:"R", version_id:[128], title:["Upgrade", "Verbesserung", "단단한 껍질", "Upgrade", "Mejora", "Оновлення"], description:"More armor defense points", max_lvl:3, chance:2, comp_items:[13], ench:["ely_upgrade"], style:"e_golem", tick:"execute as @a[tag=!ely_upgrade,predicate=powerench:ely_upgrade] run function powerench:enchantments/ely_upgrade/give\nexecute as @a[tag=ely_upgrade,predicate=!powerench:ely_upgrade] run function powerench:enchantments/ely_upgrade/clear"},
    {id:"S", version_id:[128], title:["Vein Miner", "Aderabbau", "정확한 손길", "Minerador de veias", "Extractor de vetas", "Vein Miner"], description:"Breaks connected Ores", max_lvl:3, chance:1, comp_items:[6], ench:["vein_miner", "big_mining"], style:"e_golem", tick:"execute as @a[predicate=powerench:vein_miner] at @s at @e[type=item,distance=..7,nbt={Age:0s}] run function powerench:enchantments/vein_miner/execute"},
    {id:"T", version_id:[128], title:["Venomous", "Giftiger Schlag", "독기", "Venenoso", "Envenenamiento", "Отрута"], description:"Poisons the target", max_lvl:3, chance:5, comp_items:[5], ench:["venomous", "fire_aspect", "perish"], style:"options"},
    {id:"U", version_id:[138,128], title:["Vision", "Klarsicht", "시력", "Visão", "Visión", "Нічне бачення"], description:"Gives the player night vision", max_lvl:1, chance:5, comp_items:[1], ench:["vision"], style:"e_golem", tick:"execute as @a[predicate=powerench:vision/give] run function powerench:enchantments/vision/give\nexecute as @a[tag=powerench_vision,predicate=powerench:vision/clear] run function powerench:enchantments/vision/clear"},
    {id:"ZY", version_id:[128], title:["Curse of Binding", "", "", "", "", ""], description:"Can't unequippe Armor", max_lvl:1, chance:1, comp_items:[1,2,3,4], ench:["binding_curse"], style:"vanilla curse"},
    {last_used_id:"Z - Health Upgrade", id:"ZZ", version_id:[128], title:["Curse of Vanishing", "", "", "", "", ""], description:"Item disappears on death", max_lvl:1, chance:1, comp_items:[0], ench:["vanishing_curse"], style:"vanilla curse"}
]


// ##### find translation
// under assets/indexes select newest version
// search vor language code: https://minecraft.fandom.com/wiki/Language#Languages
// under assets/objects open folder named after the first two charactes in the language hash
// open the file with the same hash
// if text is in unicode search for something like this: cyrilic codepoint to unicode converter
//      https://www.russiantools.com/en/convert-russian-to-unicode