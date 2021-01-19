

CREATE TABLE IF NOT EXISTS 

    tutors (

        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

        name VARCHAR(50) NOT NULL,

        lastName VARCHAR(50) NOT NULL,

        country VARCHAR(50) NOT NULL

    );






CREATE TABLE  IF NOT EXISTS 

    classes(

        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

        name VARCHAR (50) NOT NULL,

        degree INT NOT NULL
    );





CREATE TABLE IF NOT EXISTS 

    modules(

        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

        name VARCHAR(50) NOT NULL,

        tutorId INTEGER NOT NULL,

        startsAt DATE NOT NULL,

        endsAt DATE NOT NULL ,

        FOREIGN KEY (tutorId) REFERENCES tutors

    );


CREATE TABLE  IF NOT EXISTS 

    students(

        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, /* AUTO GENERATED ID */

        name VARCHAR (50) NOT NULL, /* NAME STRING MAX LENGTH 50 */

        lastName VARCHAR (50) NOT NULL,

        email VARCHAR (50) NOT NULL,

        image VARCHAR (200) NOT NULL,

        yearOfBirth DATE NOT NULL,
        
        gender BIT NOT NULL, /* MALE OR FEMALE 0 OR 1 */
        
        country VARCHAR(50) NOT NULL,

        classId INTEGER NOT NULL,

        FOREIGN KEY (classId) REFERENCES classes

    );






CREATE TABLE IF NOT EXISTS 
    
    scores (

        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

        moduleId INTEGER NOT NULL,

        studentId INTEGER NOT NULL,

        tutorId INTEGER NOT NULL,

        FOREIGN KEY (moduleId) REFERENCES modules,

        FOREIGN KEY (studentId) REFERENCES students,

        FOREIGN KEY (tutorId) REFERENCES tutors
    
    );


