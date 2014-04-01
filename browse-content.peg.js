start=
    (topic / nothing)+

topic=
    audience:heading
    tags:tags
    intro:intro
    careers:careers
    colleges:colleges
    pathways:pathways?
    course_groups:course_groups
    studyareas:studyareas
    contacts:contacts?
    promos:promos {
        return {
            'audience': audience,
            'tags': tags,
            'intro': intro,
            'careers': careers,
            'colleges': colleges,
            'pathways': pathways,
            'course_groups': course_groups,
            'studyareas': studyareas,
            'contacts': contacts,
            'promos': promos
        }
    }

nothing=
    audience:heading ws* 'No' .* {
        return {'audience': audience}
    }

heading= audience:("Residents" / "International") not_nl+ nl {
    return audience.trim()
}

tags= tags:(metatag / titletag)* {
    return tags
}

metatag= ws* l:"<meta" m:[^>]+ r:">" not_nl* nl? {
    return (l + m.join('') + r).trim()
}

titletag= l:"<title>" m:[^<]+ r:"</title>" nl? {
    return (l + m.join('') + r).trim()
}

intro= nl* intro:indented_lines  {
    return intro
}

careers= nl* '<h2>Careers' not_nl+ nl careers:indented_lines {
    return careers
}

colleges= nl* ('<h2>'? ' '? 'Colleges' '</h2>'?) nl colleges:indented_lines {
    return colleges
}

pathways= nl* '<h2>Pathways</h2>' nl pathways:indented_lines {
    return pathways
}

course_groups= nl* 'Courses' ws* nl ws* '<Insert courses ' [t]? 'able as per wireframe>' wsnl+ courses:course_type+ {
    return courses
}

course_type= nl* ws* type:course_type_name ' (' count:[0-9]+ ' course' [s]? ')' courses:course* {
    count = parseInt(count.join(''), 10);
    if(count != courses.length) {
        throw new Error('Course count mismatch in ' + type + ' - expected ' + count + ', got ' + courses.length + ': ' + courses.map(JSON.stringify));
    }
    return {type: type, courses: courses}
}

course_type_name=
    'Short courses' /
    'TAFE certificates and ' [Dd] 'iplomas' { return 'TAFE certificates and diplomas'} /
    'Bachelor degrees (undergraduate)' /
    'Postgraduate'

course= nl* title:course_title link:course_link data:course_data* teaser:course_teaser {
    return {title: title, link: link, teaser: teaser, data: data}
}

course_title= ws* award:course_award title:[^<]+ {
    return award + title.join('').trim()
}

course_link= '<link to: ' link:[^>]+ '>' not_nl* nl* {
    return link.join('')
}

course_data= ws* key:[A-Za-z]+ ': ' value:not_nl+ nl+ {
    var ret = {}
    ret[key.join('').toLowerCase().trim()] = value.join('').trim()
    return ret
}

course_teaser= indented_lines

course_award=
    'Advanced Diploma' /
    'Advanced Skills' /
    'Alcohol and Other Drugs' /
    'Associate Degree' /
    'Bachelor o' /
    'BAS Agent' /
    'Basic' /
    'Beginner Skills' /
    'Bridal' /
    'Build' /
    'CCNA' /
    'Certificate' /
    'Cisco' /
    'Coffee' /
    'Composting' /
    'Course in' /
    'CPR' /
    'Create' /
    'Crystal' /
    'Diploma' /
    'DIY' /
    'Doctor' /
    'Dual Diagnosis' /
    'Engineering' /
    'Food' /
    'Foundation' /
    'Furniture' /
    'Graduate' /
    'Growing' /
    'Home' /
    'Hot Stone' /
    'Immigration' /
    'Intermediate Skills' /
    'Introduction' /
    'ITIL' /
    'Licensed' /
    'Linux' /
    'Make-Up' /
    'Master' /
    'MCITP' /
    'Mental Health' /
    'National' /
    'Open Cable' /
    'Perform' /
    'Photographic' /
    'Portable' /
    'Prepare' /
    'Professional Course' /
    'Propagating' /
    'Pruning' /
    'Recognise' /
    'Registered' /
    'Responsible' /
    'Restricted' /
    'Save Money' /
    'Sculptural' /
    'Serve' /
    'Solar' /
    'Test' /
    'Vocational' /
    'Welding' /
    'Workplace'

studyareas= studyarea_heading studyareas:studyarea_summary* {
    return studyareas
}

studyarea_heading= nl* '<h2>'? ('Study areas' / 'Specialisations in' / 'Related study areas') not_nl+

studyarea_summary= nl* title:indented_line nl* image:studyarea_image? teaser:indented_lines_with_dot {
    return {title: title, image: image, teaser: teaser}
}

studyarea_image= ws* protocol:'http://' url:not_nl+ nl+ {
    return protocol + url.join('')
}


contacts= contacts:contact* {
    return contacts
}

contact= (phone_contact / email_contact / online_contact)

phone_contact= nl* first:'Ring us on' rest:not_nl+ nl* {
    return [first].concat(rest).join('')
}

email_contact= nl* first:'Email us at' rest:not_nl+ nl* {
    return [first].concat(rest).join('')
}

online_contact= nl* first:'Make an online enquiry' rest:not_nl+ nl* {
    return [first].concat(rest).join('')
}

promos= nl* promos:promo+ {
    return promos
}

promo= promo:(event / testimonial / campaign / video / ebrochure / tuition_promo / vu_english_promo / exchange_promo / apprenticeship_promo / vgsb_promo / postgrad_promo / hospitality_promo / opportunity_promo / immigration_promo / aged_care_promo / beauty_promo / cfp_promo / short_course_promo / it_promo / sport_promo / supply_chain_promo / film_tv_promo / marketing_promo / medical_promo / music_promo / nursing_promo / nutrition_promo / osteo_promo / paramedic_promo / legal_promo / pm_promo / psych_promo / pbl_promo / social_work_promo /surveyor_promo / work_experience_promo / youth_work_promo) nl* {
    return promo
}

event= ws* 'Event' nl+ event_lines:indented_lines {
    return {type: 'event', value: event_lines}
}

exchange_promo= ws* first:'You have the opportunity ' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'exchange', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

apprenticeship_promo= ws* first:'VU is focused on the delivery' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'apprenticeship', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

tuition_promo= ws* first:'Tuition fees ' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'tuition', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

vu_english_promo= ws* first:'When I started at VU English' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'vu_english', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

vgsb_promo= ws* first:'The Victoria Graduate School' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'vgsb', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

postgrad_promo= ws* first:'Victoria University (VU) postgraduate programs' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'postgrad', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

hospitality_promo= ws* first:'VU is a recognised leader' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'hospitality', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

opportunity_promo= ws* first:'Find out about how' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'opportunity', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

immigration_promo= ws* first:'VU offers courses' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'immigration_law', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

aged_care_promo= ws* first:'Demand for aged care' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'immigration_law', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

beauty_promo= ws* first:'Our students provide treatments' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'immigration_law', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

cfp_promo= ws* first:'Some students are eligible' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'cfp', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

short_course_promo= ws* first:'We offer a wide' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'short_course', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

it_promo= ws* first:'Gain skills and knowledge' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'it', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

sport_promo= ws* first:'Our $68 million' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'sport', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

supply_chain_promo= ws* first:'Victoria Universitys institute' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'supply_chain', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

film_tv_promo= ws* first:'Strong industry connections' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'film_tv', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

marketing_promo= ws* first:'Gain an in' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'marketing', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

medical_promo= ws* first:'Our courses can' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'medical', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

music_promo= ws* first:'VU has cutting' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'music', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

nursing_promo= ws* first:'Clinical learning' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'nursing', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

nutrition_promo= ws* first:'Our courses have' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'nutrition', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

osteo_promo= ws* first:'Learn to assess' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'osteo', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

paramedic_promo= ws* first:'Clinical placement' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'paramedic', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

legal_promo= ws* first:'http://www.istockphoto.com/stock-photo-1931405' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'legal', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

pm_promo= ws* first:'Develop the technical' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'pm', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

psych_promo= ws* first:'The Victoria University Psychology' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'psych', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

pbl_promo= ws* first:'VU champions Problem' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'pbl', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

social_work_promo= ws* first:'As a Victoria' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'social_work', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

surveyor_promo= ws* first:'Develop specialist skills' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'surveyor', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

work_experience_promo= ws* first:'VU students get work experience' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'work_experience', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

youth_work_promo= ws* first:'VU offers' rest:not_nl+ nl+ lines:indented_lines* {
    return {type: 'youth_work', value: [first + rest.join('')].concat(lines).join('\r\n')}
}

ebrochure= first:'Create a course e-brochure' nl+ rest:indented_lines {
    return {type: 'ebrochure', value: [first].concat(rest).join('\r\n')}
}

testimonial= '"' testimonial_lines:testimonial_lines {
    return {type: 'testimonial', value: testimonial_lines}
}

testimonial_lines= first:line rest:indented_lines? {
    return [first].concat(rest).join('\r\n')
}

campaign= title:campaign_title content:indented_or_empty_lines {
    return {type: 'campaign', value: {title: title, content: content}}
}

campaign_title= '<h3>' title:[^<]+ not_nl+ nl+ {
    return title.join('')
}

video= link:video_link text:indented_lines {
    return {type: 'video', value: {link: link, text: text}}
}

video_link= url:('http' 's'? '://www.youtube.com/watch?v=') code:not_nl+ nl+ {
    return url.join('') + code.join('')
}

line= c:not_nl* nl {
    return c.join('')
}

line_with_dot= sentences:sentence+ not_nl* nl {
    return sentences.join(' ')
}

sentence= c:[^\r\n\.]+ '.' {
    return c.join('') + '.'
}

indented_line= ws line:line {
    return line.trim()
}

indented_line_with_dot= ws line:line_with_dot {
    return line.trim()
}

indented_lines= lines:indented_line+ {
    return lines.join('\r\n').trim()
}

indented_lines_with_dot= lines:indented_line_with_dot+ {
    return lines.join('\r\n').trim()
}

indented_or_empty_lines= lines:(nl / indented_lines)+ {
    return lines.join('\r\n').trim()
}

not_nl = [^\r\n]
nl = [\r\n]
ws = [ \t]
wsnl = ws / nl
