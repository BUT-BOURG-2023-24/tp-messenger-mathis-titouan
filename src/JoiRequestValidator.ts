import * as joi from "joi";
import { Request } from "express";

interface JoiRequestValidatorResponse
{
	error?: string
}

interface JoiRouteValidator
{
	route: string,
	method: string,
	validatorSchema: joi.ObjectSchema<any>
}

class JoiRequestValidator 
{
	validators: JoiRouteValidator[] = [
		// Routes conversations
		{
		 	route: "/conversations",
		 	method: "POST",
		 	validatorSchema: joi.object({
				concernedUsersIds: joi.array().items(joi.string().required()).required(),
			})
		},
		{
			route: "/conversations/",
			method: "GET",
			validatorSchema: joi.object()
		},
		{
			route: "/conversations/:id",
			method: "DELETE",
			validatorSchema: joi.object()
		},
		{
			route: "/conversations/see/:id",
			method: "GET",
			validatorSchema: joi.object({
				messageId: joi.string().required(),
			})
		},
		{
			route: "/conversations/:id",
			method: "POST",
			validatorSchema: joi.object({
				content: joi.string().required(),
				messageReplyId: joi.string().optional(),
			})
		},

		// Routes messages
		{
			route: "/messages/:id",
			method: "PUT",
			validatorSchema: joi.object({
				newMessageContent: joi.string().required(),
			})
		},
		{
			route: "/messages/:id",
			method: "POST",
			validatorSchema: joi.object({
				reaction: joi.string().required(),
			})
		},
		{
			route: "/messages/:id",
			method: "DELETE",
			validatorSchema: joi.object()
		},

		// Routes users
		{
			route: "/users/login",
			method: "POST",
			validatorSchema: joi.object({
				username: joi.string().required(),
				password: joi.string().required(),
			})
		},
		{
			route: "/users/online",
			method: "GET",
			validatorSchema: joi.object()
		}

	];

	validate(request: Request): JoiRequestValidatorResponse 
	{
		// request.baseUrl contient l'URL de base, avant application des middlewares.
		// request.route.path contient l'URL que vous déclarez dans votre middleware de routage.
		console.log(request.baseUrl);
		console.log(request.route.path);

		/* 
			ETAPE 1:

			Trouver dans la liste de validators, le validator qui correspond à la route de la requête.
		*/
		let validator = null;
		for(let i = 0; i < this.validators.length; i++)
		{
			if(this.validators[i].route === request.baseUrl + request.route.path)
			{
				validator = this.validators[i];
				break;
			}
		}

		if(validator === null) {
			return {};
		} else {
			let validate = validator.validatorSchema.validate(request.body);
			if(validate.error) {
				return { error: validate.error.details[0].message };
			} else {
				return {};
			}
		}

		/* 
			ETAPE 2:

			Si le validator n'existe pas
				=> retourner un objet vide.
			Si le validator existe 
				=> valider le body de la requête.
				=> Si le body est valide
					=> retourner un objet vide.
				=> Si le body est invalide
					=> retourner un objet avec une clé error contenant les details de l'erreur.
		*/
	}
}

export const JoiRequestValidatorInstance = new JoiRequestValidator();