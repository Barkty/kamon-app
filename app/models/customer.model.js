const sql = require("./db.js");
const query_string = require("query-string");

// Class function for Dynamic  CRUD operations
const Customer = function (customer) {
  this.id = customer.id;
  this.first_name = customer.first_name;
  this.last_name = customer.last_name;
  this.number = customer.number;
  this.email = customer.email;
  this.password = customer.password;
  this.otp = customer.otp;
};

// CREATE = Create New users 
Customer.registerUsers = async (newCustomer, result) => {
  console.log("from customers.model.js ", newCustomer);
  
  sql.query("INSERT INTO gac_users SET ?", [newCustomer], (err, res) => {
    if (err) {
      console.log("error: ", err)
      result(err, null)
      return;
    }
    console.log("added product: ", { id: res.insertId, ...newCustomer });
    result(null, { id: res.insertId, ...newCustomer });
  })
}

// Validate via Email
Customer.validateViaEmail = async (userEmail, result) => {
  console.log(userEmail)
  sql.query(`SELECT id, email FROM gac_users WHERE email = ?`, [userEmail], (err, res) => {
    console.log("from database", res)
    console.log(Object.entries(res).length === 0)
    if (Object.entries(res).length === 0) {
      result(null, { email: "nullnull" })
      return;
    }
    if (err) {
      console.log("error: ", err);
      result(err, null);
      
    }
    else { result(null, { email: res[0].email }) }
  });
};

// READ = Find a customer in the database by its Identity
Customer.getOtpVerifications = (userID, result) => {
  sql.query(`SELECT id, email, otp FROM users WHERE id = ${userID}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found customer: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

Customer.postOtpVerifications = (userID, result) => {
  sql.query(`SELECT id, otp, verified FROM users WHERE id = ${userID}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found customer: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};


Customer.updateVerified = (id, customer, result) => {
  sql.query(
    "UPDATE users SET verified = ? WHERE id = ?",
    [customer, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated verified: ", { res });
      result(null, { id: id });
    }
  );
};

Customer.updateOtp = (id, otp, result) => {
  sql.query(
    "UPDATE users SET otp = ? WHERE id = ?",
    [otp, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated verified: ", { res });
      result(null, { id: id });
    }
  );
};

Customer.resetConfirmedPassword = (id, password, email, result) => {
  
  sql.query(
    "UPDATE users SET password = ? WHERE id = ? AND email = ?",
    [password, id, email],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated verified: ", { res });
      result(null, { id: id });
    }
  );
};


Customer.forgetPassword = (userID, result) => {
  sql.query(`SELECT id, email FROM users WHERE email = ?`, [userID], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found customer: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id `
    result({ kind: "not_found" }, null);
  });
};

// Profile route function
Customer.usersDashboard = async (id, result) => {
  await sql.query('CREATE TABLE IF NOT EXISTS loan_letter(`id` int(11) AUTO_INCREMENT NOT NULL, user_id int(11) NOT NULL, `title` text(1000) NULL, `amt` text(1000) NULL, `purpose` text(1000) NULL, `repay` text(1000) NULL, `period` text(1000) NULL, `bank` text(1000) NULL, `bank_num` text(1000) NULL, `address` text(1000) NULL, PRIMARY KEY(`id`), FOREIGN KEY(user_id) REFERENCES gac_users(id) ON DELETE CASCADE ON UPDATE CASCADE)', (x, y) => {
    if (x) {
      console.log(x)
    }
  })
  await sql.query('CREATE TABLE IF NOT EXISTS loan_form(`id` int(11) AUTO_INCREMENT NOT NULL, `user_id` int(11) NOT NULL, `surname` text(1000) NULL, `firstName` text(1000) NULL, `middleName` text(1000) NULL, `accNum` text(1000) NULL, `saveFrq` text(1000) NULL, `saveAmt` text(1000) NULL, `regDate` text(1000) NULL, `reqBirth` text(1000) NULL, `occupat` text(1000) NULL, `employ` text(1000) NULL, `busNat` text(1000) NULL, `busAdd` text(1000) NULL, `bank` text(1000) NULL, `acc_num` text(1000) NULL, `passBal` text(1000) NULL, `amt` text(1000) NULL, `purpose` text(1000) NULL, `rePayFrq` text(1000) NULL, `loanRePay` text(1000) NULL, `dayIncome` text(1000) NULL, `wekIncome` text(1000) NULL, `motIncome` text(1000) NULL, `gaName` text(1000) NULL, `memAcc` text(1000) NULL, `gaSaveBal` text(1000) NULL, `gaSavFrq` text(1000) NULL, `gaOccu` text(1000) NULL, `gaEmp` text(1000) NULL, `gaAdd` text(1000) NULL, `gaPhone` text(1000) NULL, PRIMARY KEY(`id`), FOREIGN KEY(user_id) REFERENCES gac_users(id) ON DELETE CASCADE ON UPDATE CASCADE)', (x, y) => {
    if (x) {
      console.log(x)
    }
  })
  await sql.query('CREATE TABLE IF NOT EXISTS personalgform(`id` int(11) AUTO_INCREMENT NOT NULL, `user_id` int(11) NOT NULL, `surname` text(1000) NULL, `firstName` text(1000) NULL, `middleName` text(1000) NULL, `sex` text(1000) NULL, `marital` text(1000) NULL, `reqBirth` text(1000) NULL, `occupat` text(1000) NULL, `busNat` text(1000) NULL, `busAdd` text(1000) NULL, `resAdd` text(1000) NULL, `offEmail` text(1000) NULL, `altEmail` text(1000) NULL, `phone` text(1000) NULL, `memAcc` text(1000) NULL, `gaSaveBal` text(1000) NULL, `gaSavFrq` text(1000) NULL, `gaOccu` text(1000) NULL, `gaEmp` text(1000) NULL, `gaAdd` text(1000) NULL, `gaPhone` text(1000) NULL, PRIMARY KEY(`id`), FOREIGN KEY(user_id) REFERENCES gac_users(id) ON DELETE CASCADE ON UPDATE CASCADE)', (x, y) => {
    if (x) {
      console.log(x)
    }
  })
  await sql.query('CREATE TABLE IF NOT EXISTS membership(`id` int(11) AUTO_INCREMENT NOT NULL, `user_id` int(11) NOT NULL, `office` text(1000) NULL, `legal` text(1000) NULL, `staff` text(1000) NULL, `firstName` text(1000) NULL, `midName` text(1000) NULL, `lastName` text(1000) NULL, `acc_num` text(1000) NULL, `exId` text(1000) NULL,  `sex` text(1000) NULL, `num` text(1000) NULL, `activate` text(1000) NULL, `submit` text(1000) NULL, `dob` text(1000) NULL, `clientTy` text(1000) NULL, `clientCla` text(1000) NULL, `MfirstName` text(1000) NULL, `MmidName` text(1000) NULL, `MlastName` text(1000) NULL, `qualif` text(1000) NULL, `Mphone` text(1000) NULL, `Mage` text(1000) NULL, `depend` text(1000) NULL, `rel` text(1000) NULL, `gender` text(1000) NULL, `prof` text(1000) NULL, `Mstatus` text(1000) NULL, `Mdob` text(1000) NULL, `id_doc` text(1000) NULL, `id_status` text(1000) NULL, `id_uniq` text(1000) NULL, `con_client` text(1000) NULL, `con_mobil2` text(1000) NULL, `con_mobil3` text(1000) NULL, `con_email` text(1000) NULL, `ad_client` text(1000) NULL, `ad_add1` text(1000) NULL, `ad_add2` text(1000) NULL, `ad_country` text(1000) NULL, `ad_state` text(1000) NULL, `ad_city` text(1000) NULL, `ad_post` text(1000) NULL, `kin_client` text(1000) NULL, `kin_name` text(1000) NULL, `kin_add1` text(1000) NULL, `kin_add2` text(1000) NULL, `kin_country` text(1000) NULL, `kin_state` text(1000) NULL, `kin_city` text(1000) NULL, `kin_post` text(1000) NULL, `kin_mobile1` text(1000) NULL, `kin_mobile2` text(1000) NULL, `jb_id` text(1000) NULL, `jb_name` text(1000) NULL, `jb_type` text(1000) NULL, `jb_role` text(1000) NULL, `jb_occup` text(1000) NULL, `jb_add` text(1000) NULL, `jb_add2` text(1000) NULL, `jb_country` text(1000) NULL, `jb_state` text(1000) NULL, `jb_city` text(1000) NULL,   PRIMARY KEY(`id`), FOREIGN KEY(user_id) REFERENCES gac_users(id) ON DELETE CASCADE ON UPDATE CASCADE)', (x, y) => {
    if (x) {
      console.log(x)
    }
  })
  sql.query('SELECT * FROM gac_users WHERE id=?', [id], function (err, res) {
    if (err) {
      console.log("error", err);
      result(null, err)
    } else { result(null, res) }
  });
}
// READ = Find a customer in the database by its Identity
Customer.findById = (customerId, result) => {
  sql.query(`SELECT * FROM customers WHERE id = ${customerId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found customer: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

// READ = Get all customer from the database
Customer.getAll = result => {
  sql.query("SELECT * FROM customers", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("customers: ", res);
    result(null, res);
  });
};

//UPDATE = update a customer details by its ID 
Customer.updateById = (id, customer, result) => {
  sql.query(
    "UPDATE customers SET email = ?, name = ?, active = ? WHERE id = ?",
    [customer.email, customer.name, customer.active, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated customer: ", { id: id, ...customer });
      result(null, { id: id, ...customer });
    }
  );
};


// DELETE = Delete a product from the database by its ID
Customer.remove = (id, result) => {
  sql.query("DELETE FROM kach_products WHERE id = ?", parseInt(id) , (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted customer with id: ", id);
    result(null, res);
  });
};

// DELETE = Delete all customers from the database
Customer.removeAll = result => {
  sql.query("DELETE FROM customers", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log(`deleted ${res.affectedRows} customers`);
    result(null, res);
  });
};

// READ = Get all product from database for visitors(Thos visiting our website that hasn't registered yet or has registered and logout)
Customer.getAllVisitorsProducts = result => {
  sql.query("SELECT * FROM kach_products ORDER BY id DESC", (err, res) => {

    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }else{result(null, res);}
  });
};

// Profile route function
Customer.settings = (id, result) => {
  sql.query('SELECT * FROM users WHERE id=?', [id], function (err, res) {
      if (err) {
        console.log("error", err);
        result(null, err)
      }else{result(null, res)}
      
    });
}
// Update Proflle Route
Customer.updateProfile = (id, body, result) => {
  const { fullName, number, address } = body;
  sql.query(`UPDATE client_reg SET fullName=?, number=?, location=? WHERE id=?`, [fullName, number, address, id], function (err, res) {
    if (err) {
      console.log("error", err);
      result(null, err)
    }else{result(null, res)}
    
  });
}

//Add to cart Functionality
Customer.addToCart = (id, result) => {
  let userID = query_string.parse(id)
  let productID = userID.pid
  let clientID = userID.cid
  let moq, qty, amount, total, title;
  sql.query('CREATE TABLE IF NOT EXISTS `cart`(`id` int(11) NOT NULL AUTO_INCREMENT, `client_id` int(11) NOT NULL, `title` text(1000) NOT NULL, `qty` int(11) NOT NULL, `moq` int(11) NOT NULL, `amt` int(11) NOT NULL, `total` int(11) NOT NULL, PRIMARY KEY(`id`), FOREIGN KEY(client_id) REFERENCES client_reg(id) ON DELETE CASCADE ON UPDATE CASCADE)');
  sql.query(`SELECT * FROM kach_products WHERE id=${productID}`, (err, responds) => {
    if (err) console.log(err)
    for (var i in responds) {
      moq = responds[i].moq;
      qty = responds[i].qty;
      title = responds[i].title;
      amount = responds[i].amount;
      total = responds[i].total;
    }
    sql.query("INSERT INTO cart(client_id, title, qty, moq, amt, total) VALUES(?,?,?,?,?,?)", [clientID, title, qty, qty, amount, total], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      //console.log("Item added to cart : ", { id: res.insertId });
      else { result(null, { id: res.insertId }) }
    });
  })
};

// Go to cart functionality
Customer.goToCart = (id, result) => {
  sql.query(`SELECT *, cart.id AS pid FROM cart INNER JOIN client_reg ON(cart.client_id=client_reg.id)  WHERE cart.client_id=${id} ORDER BY cart.id DESC`, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
}

// Delete from Cart Functionality
Customer.deleteFromCart = (id, result) => {
  let userID = query_string.parse(id)
  let productID = userID.pid
  let clientID = userID.cid
  sql.query(`DELETE FROM cart WHERE id=${productID} AND client_id=${clientID}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err)
      return;
    } result(null, res)
  })
}

// increase product quatity functinality
Customer.increaseQTY = (id, results) => {
  let userID = query_string.parse(id)
  let productID = userID.pid
  let clientID = userID.cid
  sql.query('SELECT  qty, amt, total FROM cart WHERE id=? AND client_id=?', [productID, clientID], (err, result) => {
    if (err) {
      console.log("error: ", err);
      results(null, err)
      return;
    }
    let Amount, Quantity, total;
    if (result.length > 0) {
      for (var value in result) {
        Amount = result[value].amt;
        Quantity = result[value].qty;
        total = result[value].total
      }
    }
    if (Quantity >= 1) { Quantity++; }
    else { Quantity = 1; }
    total = Amount * Quantity;
    sql.query(`UPDATE cart SET qty = ${Quantity}, amt=${Amount}, total=${total} WHERE id=? AND client_id=?`, [productID, clientID], (eRr, res) => {
      if (eRr) {
        console.log("error: ", eRr);
        results(null, eRr)
        return;
      } results(null, res)
    })
  })
}

// Reduce product quantity functinality
Customer.reduceQTY = (id, results) => {
  let userID = query_string.parse(id)
  let productID = userID.pid
  let clientID = userID.cid

  sql.query('SELECT  qty, amt, total FROM cart WHERE id=? AND client_id=?', [productID, clientID], (err, result) => {
    if (err) {
      console.log("error: ", err);
      results(null, err)
      return;
    }
    var Amount, Quantity, total;
    if (result.length > 0) {
      for (var value in result) {
        Amount = result[value].amt;
        Quantity = result[value].qty;
        total = result[value].total
      }
    }
    if (Quantity == 1 || Quantity == 0) {
      Quantity = 1;
    } else {
      Quantity = (Quantity - 1);
    }
    total = Amount * Quantity;
    console.log(Amount, Quantity);

    sql.query(`UPDATE cart SET qty = ${Quantity}, amt=${Amount}, total=${total} WHERE id=? AND client_id=?`, [productID, clientID], (eRr, res) => {
      if (eRr) {
        console.log("error: ", eRr);
        results(null, eRr)
        return;
      } results(null, res)
    })
  })
}

// Checkout button database functionality
Customer.flutterwaveCheckOut = (id, result) => {
  sql.query(`SELECT *, cart.id AS pid FROM cart INNER JOIN client_reg ON(cart.client_id=client_reg.id)  WHERE cart.client_id=${id}`, function (err, res) {
    if (err) {
      console.log("error", err);
      result(null, err)
    } else { result(null, res) }

  });
}

Customer.loanLetter = (id, result) => {
  sql.query(`SELECT *, gac_users.id AS uid FROM loan_letter INNER JOIN gac_users ON(loan_letter.user_id=gac_users.id)  WHERE loan_letter.user_id=${id}`, function (err, res) {
    if (err) {
      console.log("error", err);
      result(null, err)
    } else { result(null, res) }
  });
}
Customer.personalgform = (id, result) => {
  sql.query(`SELECT *, gac_users.id AS uid FROM personalgform INNER JOIN gac_users ON(personalgform.user_id=gac_users.id)  WHERE personalgform.user_id=${id}`, function (err, res) {
    if (err) {
      console.log("error", err);
      result(null, err)
    } else { result(null, res) }
  });
}
//LOAN FORM
Customer.loanForm = (id, result) => {
  sql.query(`SELECT *, gac_users.id AS uid FROM loan_form INNER JOIN gac_users ON(loan_form.user_id=gac_users.id)  WHERE loan_form.user_id=${id}`, function (err, res) {
    if (err) {
      console.log("error", err);
      result(null, err)
    } else { result(null, res) }
  });
}
Customer.membership = (id, result) => {
  sql.query(`SELECT *, gac_users.id AS uid FROM membership INNER JOIN gac_users ON(membership.user_id=gac_users.id)  WHERE membership.user_id=${id}`, function (err, res) {
    if (err) {
      console.log("error", err);
      result(null, err)
    } else { result(null, res) }
  });
}

// admin dashboad database functionality
Customer.adminDashboard = result => {
  sql.query("SELECT * FROM gac_users ORDER BY id DESC", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
    }
    else {
      sql.query('SELECT * FROM loan_form ORDER BY id DESC', (errors, response) => {
        if (errors) {
          console.log("error", errors)
          result(null, errors)
        }
        else { 
          sql.query("SELECT * FROM membership ORDER BY id DESC", (memErr, memRes)=>{
            if(memErr){
              console.log(memErr)
              result(null, memErr)
            }else{
              sql.query("SELECT * FROM loan_letter ORDER BY id DESC", (laonErr, loanRes)=>{
                if(laonErr){
                  console.log(laonErr)
                  result(null, laonErr)
                }else{
                  sql.query("SELECT * FROM personalgform ORDER BY id DESC", (persErr, persRes)=>{
                    if(persErr){
                      console.log(persErr)
                      result(null, persErr)
                    }else{
                      result(null, res, response, memRes, loanRes, persRes)
                    }
                  })
                }
              })
            }
          })
        }
      });
    }
  });
}

// admin-users crud operation // admin get all registered users

Customer.adminDeleteUserWithID =(id, table, result) => {
  sql.query(`DELETE FROM ${table} WHERE id = ?`,[id], (err, res) => {
    if (err) {
      console.log("error", err)
      result(null, err)
    }
    else { result(null, res) }
  })
}
module.exports = Customer;
